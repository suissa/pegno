#!/usr/bin/env bun
/**
 * Script automatizado para corrigir erros do ESLint
 * Uso: bun run fix-eslint.ts [arquivo.ts]
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

interface EslintError {
  line: number;
  column: number;
  message: string;
  ruleId: string;
}

function runEslint(file: string): string {
  try {
    execSync(`npx eslint ${file}`, { encoding: 'utf-8' });
    return '';
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'stdout' in error) {
      return String((error as { stdout: unknown }).stdout);
    }
    return '';
  }
}

function parseEslintOutput(output: string): EslintError[] {
  const errors: EslintError[] = [];
  const lines = output.split('\n');

  for (const line of lines) {
    const match = line.match(/^\s+(\d+):(\d+)\s+error\s+(.+?)\s{2,}([@\w-/]+)$/);
    if (match) {
      errors.push({
        line: parseInt(match[1]),
        column: parseInt(match[2]),
        message: match[3].trim(),
        ruleId: match[4],
      });
    }
  }

  return errors;
}

function fixLongLines(content: string, errors: EslintError[]): string {
  const lines = content.split('\n');

  for (const error of errors) {
    if (!error.message.includes('Maximum allowed is 100')) {
      continue;
    }

    const lineIndex = error.line - 1;
    const line = lines[lineIndex];

    // Quebrar linhas longas em ternários
    if (line.includes('?') && line.includes(':')) {
      const indent = line.match(/^(\s*)/)?.[1] ?? '';
      const parts = line.split('?');
      if (parts.length === 2) {
        const condition = parts[0].trim();
        const [truePart, falsePart] = parts[1].split(':').map(p => p.trim());
        lines[lineIndex] = `${indent}${condition}\n${indent}  ? ${truePart}\n${indent}  : ${falsePart}`;
      }
    }
  }

  return lines.join('\n');
}

function main(): void {
  const file = process.argv[2];

  if (!file) {
    console.log('❌ Uso: bun run fix-eslint.ts <arquivo.ts>');
    process.exit(1);
  }

  console.log(`🔍 Analisando ${file}...`);

  // Primeiro, tentar corrigir automaticamente com --fix
  try {
    execSync(`npx eslint ${file} --fix`, { stdio: 'inherit' });
    console.log('✅ Correções automáticas aplicadas');
  } catch {
    // Ignorar erros, vamos verificar o que sobrou
  }

  // Verificar erros restantes
  const output = runEslint(file);
  if (!output) {
    console.log('✨ Nenhum erro encontrado!');
    return;
  }

  const errors = parseEslintOutput(output);
  console.log(`\n📊 ${errors.length} erros restantes`);

  // Agrupar por tipo
  const errorsByType = new Map<string, number>();
  for (const error of errors) {
    errorsByType.set(error.ruleId, (errorsByType.get(error.ruleId) ?? 0) + 1);
  }

  console.log('\n📋 Distribuição:');
  for (const [rule, count] of Array.from(errorsByType.entries()).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${count}x ${rule}`);
  }

  // Aplicar correções customizadas
  let content = readFileSync(file, 'utf-8');
  const originalContent = content;

  // Corrigir linhas longas
  const longLineErrors = errors.filter(e => e.ruleId === 'max-len');
  if (longLineErrors.length > 0) {
    console.log('\n🔧 Corrigindo linhas longas...');
    content = fixLongLines(content, longLineErrors);
  }

  if (content !== originalContent) {
    writeFileSync(file, content, 'utf-8');
    console.log('💾 Arquivo atualizado');

    // Verificar novamente
    const finalOutput = runEslint(file);
    const finalErrors = parseEslintOutput(finalOutput);
    console.log(`\n✅ ${errors.length - finalErrors.length} erros corrigidos`);
    console.log(`⚠️  ${finalErrors.length} erros restantes`);
  }
}

main();
