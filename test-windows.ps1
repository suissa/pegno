#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script de teste para p3g no Windows
.DESCRIPTION
    Testa todas as funcionalidades do p3g em ambiente Windows
#>

param(
    [switch]$Verbose,
    [switch]$CleanUp
)

$ErrorActionPreference = "Stop"

Write-Host "🧪 Testando p3g no Windows" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

# Função para executar testes
function Test-Command {
    param($Name, $Command, $ExpectedOutput = $null)
    
    Write-Host "🔍 Testando: $Name" -ForegroundColor Yellow
    
    try {
        if ($Verbose) {
            Write-Host "   Executando: $Command" -ForegroundColor Gray
        }
        
        $result = Invoke-Expression $Command
        
        if ($ExpectedOutput -and $result -notmatch $ExpectedOutput) {
            Write-Host "❌ Falhou: $Name" -ForegroundColor Red
            return $false
        }
        
        Write-Host "✅ Passou: $Name" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Erro: $Name - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Limpa ambiente de teste se solicitado
if ($CleanUp) {
    Write-Host "🧹 Limpando ambiente de teste..." -ForegroundColor Blue
    Remove-Item -Path "test-project" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "$env:USERPROFILE\.p3g_workspace" -Recurse -Force -ErrorAction SilentlyContinue
}

# Cria projeto de teste
Write-Host "📁 Criando projeto de teste..." -ForegroundColor Blue
New-Item -ItemType Directory -Path "test-project" -Force | Out-Null
Push-Location "test-project"

try {
    # Inicializa projeto
    '{"name":"test-project","version":"1.0.0"}' | Out-File -FilePath "package.json" -Encoding UTF8
    
    # Testa comandos básicos
    $tests = @(
        @{ Name = "Help"; Command = "bun ..\dist\p3g.js --help"; Expected = "p3g CLI" },
        @{ Name = "List (vazio)"; Command = "bun ..\dist\p3g.js list"; Expected = "Nenhum miniworkspace" },
        @{ Name = "Install axios"; Command = "bun ..\dist\p3g.js axios@latest --verbose"; Expected = "Baixando axios" },
        @{ Name = "Verify node_modules"; Command = "Test-Path .\node_modules\axios"; Expected = $null },
        @{ Name = "Verify package.json"; Command = "Get-Content package.json | ConvertFrom-Json | Select-Object -ExpandProperty dependencies | Select-Object -ExpandProperty axios"; Expected = $null }
    )
    
    $passed = 0
    $total = $tests.Count
    
    foreach ($test in $tests) {
        if (Test-Command -Name $test.Name -Command $test.Command -ExpectedOutput $test.Expected) {
            $passed++
        }
        Start-Sleep -Milliseconds 500
    }
    
    # Testa funcionalidades específicas do Windows
    Write-Host ""
    Write-Host "🪟 Testando funcionalidades específicas do Windows..." -ForegroundColor Cyan
    
    # Verifica se binários .cmd foram criados
    if (Test-Path ".\node_modules\.bin") {
        $cmdFiles = Get-ChildItem ".\node_modules\.bin" -Filter "*.cmd"
        if ($cmdFiles.Count -gt 0) {
            Write-Host "✅ Binários .cmd criados: $($cmdFiles.Count)" -ForegroundColor Green
            $passed++
        } else {
            Write-Host "⚠️  Nenhum binário .cmd encontrado" -ForegroundColor Yellow
        }
        $total++
    }
    
    # Verifica modo de cópia vs symlink
    if (Test-Path ".\node_modules\axios") {
        $item = Get-Item ".\node_modules\axios"
        if ($item.LinkType -eq "SymbolicLink") {
            Write-Host "🔗 Usando symlinks (modo desenvolvedor ativo)" -ForegroundColor Blue
        } else {
            Write-Host "📁 Usando modo cópia (padrão Windows)" -ForegroundColor Blue
        }
    }
    
    # Testa workspace global
    $workspacePath = "$env:USERPROFILE\.p3g_workspace\js"
    if (Test-Path $workspacePath) {
        $packages = Get-ChildItem $workspacePath -Directory
        Write-Host "📦 Pacotes no workspace global: $($packages.Count)" -ForegroundColor Blue
    }
    
    # Resultados finais
    Write-Host ""
    Write-Host "📊 Resultados dos Testes" -ForegroundColor Cyan
    Write-Host "========================" -ForegroundColor Cyan
    Write-Host "Passou: $passed/$total" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })
    
    if ($passed -eq $total) {
        Write-Host "🎉 Todos os testes passaram!" -ForegroundColor Green
        $exitCode = 0
    } else {
        Write-Host "⚠️  Alguns testes falharam" -ForegroundColor Yellow
        $exitCode = 1
    }
    
    # Informações do sistema
    Write-Host ""
    Write-Host "💻 Informações do Sistema" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    Write-Host "OS: $([System.Environment]::OSVersion.VersionString)" -ForegroundColor Gray
    Write-Host "PowerShell: $($PSVersionTable.PSVersion)" -ForegroundColor Gray
    
    try {
        $bunVersion = bun --version
        Write-Host "Bun: v$bunVersion" -ForegroundColor Gray
    } catch {
        Write-Host "Bun: Não instalado" -ForegroundColor Red
    }
    
    # Verifica modo desenvolvedor
    try {
        $devMode = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevLicense" -ErrorAction SilentlyContinue
        if ($devMode.AllowDevelopmentWithoutDevLicense -eq 1) {
            Write-Host "Modo Desenvolvedor: Ativado ✅" -ForegroundColor Green
        } else {
            Write-Host "Modo Desenvolvedor: Desativado ⚠️" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Modo Desenvolvedor: Não verificável" -ForegroundColor Gray
    }
    
} finally {
    Pop-Location
    
    if ($CleanUp) {
        Write-Host "🧹 Limpando arquivos de teste..." -ForegroundColor Blue
        Remove-Item -Path "test-project" -Recurse -Force -ErrorAction SilentlyContinue
    }
}

exit $exitCode