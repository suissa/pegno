#!/usr/bin/env pwsh
# Script de teste de integração local para Pegno
# Testa instalação de Vite + Shadcn + Tailwind

param(
    [switch]$WSL,
    [switch]$Windows,
    [switch]$All
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "`n🔹 $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Failure {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Test-Windows {
    Write-Host "`n========================================" -ForegroundColor Yellow
    Write-Host "🪟 TESTANDO NO WINDOWS" -ForegroundColor Yellow
    Write-Host "========================================`n" -ForegroundColor Yellow
    
    try {
        Write-Step "Criando diretório de teste..."
        $testDir = "$env:TEMP\pegno-test-windows-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        New-Item -ItemType Directory -Force -Path $testDir | Out-Null
        Set-Location $testDir
        Write-Success "Diretório criado: $testDir"
        
        Write-Step "Criando projeto Vite..."
        bun create vite test-app --template react-ts
        Set-Location test-app
        Write-Success "Projeto Vite criado"
        
        Write-Step "Instalando Tailwind com Pegno..."
        node "$PSScriptRoot\dist\pegno.js" install tailwindcss postcss autoprefixer
        if (-not (Test-Path "node_modules/tailwindcss")) {
            throw "Tailwind não foi instalado"
        }
        Write-Success "Tailwind instalado"
        
        Write-Step "Inicializando Tailwind..."
        bunx tailwindcss init -p
        if (-not (Test-Path "tailwind.config.js")) {
            throw "Tailwind config não foi criado"
        }
        Write-Success "Tailwind inicializado"
        
        Write-Step "Instalando dependências Shadcn com Pegno..."
        node "$PSScriptRoot\dist\pegno.js" install class-variance-authority clsx tailwind-merge lucide-react --dev
        node "$PSScriptRoot\dist\pegno.js" install @radix-ui/react-slot
        Write-Success "Dependências Shadcn instaladas"
        
        Write-Step "Verificando instalações..."
        $packages = @(
            "tailwindcss",
            "postcss",
            "autoprefixer",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react",
            "@radix-ui/react-slot"
        )
        
        foreach ($pkg in $packages) {
            if (Test-Path "node_modules/$pkg") {
                Write-Success "$pkg instalado"
            } else {
                throw "$pkg NÃO instalado"
            }
        }
        
        Write-Step "Testando build..."
        bun run build
        if (-not (Test-Path "dist")) {
            throw "Build falhou"
        }
        Write-Success "Build executado com sucesso"
        
        Write-Host "`n🎉 TESTE WINDOWS PASSOU!" -ForegroundColor Green
        return $true
        
    } catch {
        Write-Failure "Erro no teste Windows: $_"
        return $false
    } finally {
        Set-Location $PSScriptRoot
    }
}

function Test-WSL {
    Write-Host "`n========================================" -ForegroundColor Yellow
    Write-Host "🐧 TESTANDO NO WSL" -ForegroundColor Yellow
    Write-Host "========================================`n" -ForegroundColor Yellow
    
    try {
        Write-Step "Verificando se WSL está disponível..."
        $wslCheck = wsl --list --quiet 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "WSL não está disponível"
        }
        Write-Success "WSL disponível"
        
        Write-Step "Criando script de teste para WSL..."
        $wslScript = @"
#!/bin/bash
set -e

export BUN_INSTALL="`$HOME/.bun"
export PATH="`$BUN_INSTALL/bin:`$PATH"

echo "🔹 Verificando Bun..."
if ! command -v bun &> /dev/null; then
    echo "🔹 Instalando Bun..."
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="`$HOME/.bun"
    export PATH="`$BUN_INSTALL/bin:`$PATH"
fi
bun --version

TEST_DIR="/tmp/pegno-test-wsl-`$(date +%Y%m%d-%H%M%S)"
echo "🔹 Criando diretório de teste: `$TEST_DIR"
mkdir -p `$TEST_DIR
cd `$TEST_DIR

echo "🔹 Criando projeto Vite..."
bun create vite test-app --template react-ts
cd test-app

echo "🔹 Instalando Tailwind com Pegno..."
PEGNO_PATH=`$(wslpath -u "$($PSScriptRoot -replace '\\', '/')")
node "`$PEGNO_PATH/dist/pegno.js" install tailwindcss postcss autoprefixer

if [ ! -d "node_modules/tailwindcss" ]; then
    echo "❌ Tailwind não foi instalado"
    exit 1
fi
echo "✅ Tailwind instalado"

echo "🔹 Inicializando Tailwind..."
bunx tailwindcss init -p

if [ ! -f "tailwind.config.js" ]; then
    echo "❌ Tailwind config não foi criado"
    exit 1
fi
echo "✅ Tailwind inicializado"

echo "🔹 Instalando dependências Shadcn com Pegno..."
node "`$PEGNO_PATH/dist/pegno.js" install class-variance-authority clsx tailwind-merge lucide-react --dev
node "`$PEGNO_PATH/dist/pegno.js" install @radix-ui/react-slot
echo "✅ Dependências Shadcn instaladas"

echo "🔹 Verificando instalações..."
packages=(
    "tailwindcss"
    "postcss"
    "autoprefixer"
    "class-variance-authority"
    "clsx"
    "tailwind-merge"
    "lucide-react"
    "@radix-ui/react-slot"
)

for pkg in "`${packages[@]}"; do
    if [ -d "node_modules/`$pkg" ]; then
        echo "✅ `$pkg instalado"
    else
        echo "❌ `$pkg NÃO instalado"
        exit 1
    fi
done

echo "🔹 Testando build..."
bun run build

if [ ! -d "dist" ]; then
    echo "❌ Build falhou"
    exit 1
fi
echo "✅ Build executado com sucesso"

echo ""
echo "🎉 TESTE WSL PASSOU!"
"@
        
        $wslScriptPath = "$env:TEMP\pegno-wsl-test.sh"
        $wslScript | Out-File -FilePath $wslScriptPath -Encoding utf8 -NoNewline
        
        Write-Step "Executando teste no WSL..."
        wsl bash $wslScriptPath
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n🎉 TESTE WSL PASSOU!" -ForegroundColor Green
            return $true
        } else {
            throw "Teste WSL falhou com código $LASTEXITCODE"
        }
        
    } catch {
        Write-Failure "Erro no teste WSL: $_"
        return $false
    }
}

# Main
Write-Host @"

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🧪 TESTE DE INTEGRAÇÃO PEGNO                           ║
║   Vite + Shadcn + Tailwind                               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

"@ -ForegroundColor Magenta

# Verificar se Pegno está buildado
if (-not (Test-Path "$PSScriptRoot\dist\pegno.js")) {
    Write-Failure "Pegno não está buildado. Execute: bun run build"
    exit 1
}

$results = @{}

if ($All -or (-not $WSL -and -not $Windows)) {
    $results["Windows"] = Test-Windows
    $results["WSL"] = Test-WSL
} else {
    if ($Windows) {
        $results["Windows"] = Test-Windows
    }
    if ($WSL) {
        $results["WSL"] = Test-WSL
    }
}

# Resumo
Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "📊 RESUMO DOS TESTES" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow

$allPassed = $true
foreach ($test in $results.Keys) {
    if ($results[$test]) {
        Write-Success "$test: PASSOU"
    } else {
        Write-Failure "$test: FALHOU"
        $allPassed = $false
    }
}

if ($allPassed) {
    Write-Host "`n🎉 TODOS OS TESTES PASSARAM!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n⚠️ ALGUNS TESTES FALHARAM" -ForegroundColor Red
    exit 1
}
