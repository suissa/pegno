#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Instalador do p3g para Windows
.DESCRIPTION
    Script de instalação que configura o p3g no Windows com todas as dependências necessárias
.EXAMPLE
    .\install-windows.ps1
#>

param(
    [switch]$Global,
    [switch]$DevMode,
    [string]$InstallPath = "$env:LOCALAPPDATA\p3g"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Instalador p3g para Windows" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Verifica se o Bun está instalado
try {
    $bunVersion = bun --version
    Write-Host "✅ Bun encontrado: v$bunVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Bun não encontrado. Instalando..." -ForegroundColor Red
    
    # Instala Bun usando PowerShell
    try {
        irm bun.sh/install.ps1 | iex
        Write-Host "✅ Bun instalado com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Falha ao instalar Bun. Instale manualmente: https://bun.sh" -ForegroundColor Red
        exit 1
    }
}

# Cria diretório de instalação
if (-not (Test-Path $InstallPath)) {
    New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
    Write-Host "📁 Diretório criado: $InstallPath" -ForegroundColor Blue
}

# Copia arquivos
Copy-Item "p3g.ts" "$InstallPath\p3g.ts" -Force
Copy-Item "package.json" "$InstallPath\package.json" -Force

Write-Host "📦 Arquivos copiados para $InstallPath" -ForegroundColor Blue

# Instala dependências
Push-Location $InstallPath
try {
    Write-Host "⬇️  Instalando dependências..." -ForegroundColor Yellow
    bun install
    Write-Host "✅ Dependências instaladas!" -ForegroundColor Green
    
    # Build do projeto
    Write-Host "🔨 Compilando p3g..." -ForegroundColor Yellow
    bun build p3g.ts --outdir . --target bun --outfile p3g.js
    Write-Host "✅ Compilação concluída!" -ForegroundColor Green
} finally {
    Pop-Location
}

# Cria script de execução
$execScript = @"
@echo off
bun "$InstallPath\p3g.js" %*
"@

$execScriptPath = "$InstallPath\p3g.cmd"
$execScript | Out-File -FilePath $execScriptPath -Encoding ASCII

# Adiciona ao PATH se solicitado
if ($Global) {
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    if ($currentPath -notlike "*$InstallPath*") {
        [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$InstallPath", "User")
        Write-Host "✅ p3g adicionado ao PATH do usuário" -ForegroundColor Green
        Write-Host "⚠️  Reinicie o terminal para usar 'p3g' globalmente" -ForegroundColor Yellow
    } else {
        Write-Host "✅ p3g já está no PATH" -ForegroundColor Green
    }
}

# Verifica modo desenvolvedor para symlinks
if ($DevMode) {
    try {
        $devMode = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevLicense" -ErrorAction SilentlyContinue
        if ($devMode.AllowDevelopmentWithoutDevLicense -eq 1) {
            Write-Host "✅ Modo desenvolvedor ativado - symlinks disponíveis" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Modo desenvolvedor não ativado. p3g usará modo cópia por padrão" -ForegroundColor Yellow
            Write-Host "   Para ativar symlinks: Configurações > Atualização e Segurança > Para desenvolvedores" -ForegroundColor Gray
        }
    } catch {
        Write-Host "⚠️  Não foi possível verificar o modo desenvolvedor" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Instalação concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "Uso:" -ForegroundColor Cyan
if ($Global) {
    Write-Host "  p3g axios@latest" -ForegroundColor White
    Write-Host "  p3g --help" -ForegroundColor White
} else {
    Write-Host "  $InstallPath\p3g.cmd axios@latest" -ForegroundColor White
    Write-Host "  $InstallPath\p3g.cmd --help" -ForegroundColor White
}
Write-Host ""
Write-Host "Workspace global: $env:USERPROFILE\.p3g_workspace" -ForegroundColor Gray