# 🤖 GitHub Actions Workflows

Este diretório contém todos os workflows automatizados do Pegno.

## 📋 Workflows Disponíveis

### 🔄 CI/CD Pipeline (`ci.yml`)
- **Trigger**: Push para `main`/`develop`, PRs para `main`, releases
- **Funcionalidades**:
  - ✅ Testes e build automatizados
  - 📦 Publicação automática no NPM em releases
  - 🔒 Auditoria de segurança
  - 📤 Upload de artefatos de build

### 🚀 Release (`release.yml`)
- **Trigger**: Tags `v*`
- **Funcionalidades**:
  - 📋 Criação automática de releases no GitHub
  - 📎 Upload do binário compilado
  - 📝 Notas de release automáticas

### 🔍 Code Quality (`quality.yml`)
- **Trigger**: Push para `main`/`develop`, PRs para `main`
- **Funcionalidades**:
  - 🎯 Verificação TypeScript strict
  - 📏 Análise de tamanho de arquivos
  - 🏗️ Validação da arquitetura de arquivo único
  - 📦 Verificação de dependências mínimas

### 🛡️ CodeQL Security (`codeql.yml`)
- **Trigger**: Push, PRs, schedule semanal
- **Funcionalidades**:
  - 🔒 Análise de segurança automatizada
  - 🚨 Detecção de vulnerabilidades
  - 📊 Relatórios de qualidade de código

### 🤖 Dependabot Auto-merge (`dependabot-auto-merge.yml`)
- **Trigger**: PRs do Dependabot
- **Funcionalidades**:
  - ⚡ Auto-merge para atualizações patch/minor
  - ✅ Testes automáticos antes do merge
  - 🔒 Aprovação automática para updates seguros

## 🔧 Configuração Necessária

### Secrets do GitHub
Para que os workflows funcionem completamente, configure estes secrets:

```bash
# NPM Token para publicação
NPM_TOKEN=npm_xxxxxxxxxxxxxxxx

# GitHub Token (já disponível automaticamente)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
```

### Como Configurar NPM Token
1. Acesse [npmjs.com](https://www.npmjs.com)
2. Vá em Account → Access Tokens
3. Crie um token com permissão "Automation"
4. Adicione como secret `NPM_TOKEN` no GitHub

## 📊 Status dos Workflows

Os workflows são executados automaticamente e você pode acompanhar o status:

- 🟢 **Passing**: Tudo funcionando
- 🟡 **Pending**: Em execução
- 🔴 **Failed**: Erro encontrado

## 🎯 Dependabot

O Dependabot está configurado para:
- 📅 Verificações semanais (segundas às 09:00)
- 📦 Atualizações de dependências npm
- 🔧 Atualizações de GitHub Actions
- 🤖 Auto-merge para updates seguros

## 🚀 Como Fazer um Release

1. **Atualize a versão**:
   ```bash
   # Edite package.json manualmente ou use:
   bun version patch  # ou minor, major
   ```

2. **Crie e push a tag**:
   ```bash
   git add package.json
   git commit -m "🚀 :rocket: Release v1.0.1"
   git tag v1.0.1
   git push origin main --tags
   ```

3. **Automático**: O workflow criará o release e publicará no NPM

## 🔍 Monitoramento

- **GitHub Actions**: Veja todos os workflows na aba "Actions"
- **Security**: Alertas de segurança na aba "Security"
- **Dependabot**: PRs automáticos na aba "Pull requests"

## 🛠️ Troubleshooting

### Build Falhando
- Verifique se `pegno.ts` compila localmente
- Confirme que `bun run build` funciona
- Verifique se não há dependências quebradas

### NPM Publish Falhando
- Confirme se `NPM_TOKEN` está configurado
- Verifique se a versão no `package.json` é única
- Confirme se o usuário NPM tem permissões

### Dependabot Issues
- PRs do Dependabot são auto-merged apenas para patch/minor
- Updates major precisam de revisão manual
- Falhas de build impedem auto-merge