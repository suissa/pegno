#!/usr/bin/env bash
# Script de teste de integração local para Pegno
# Testa instalação de Vite + Shadcn + Tailwind

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

function write_step() {
    echo -e "\n${CYAN}🔹 $1${NC}"
}

function write_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

function write_failure() {
    echo -e "${RED}❌ $1${NC}"
}

function test_linux() {
    echo -e "\n${YELLOW}========================================${NC}"
    echo -e "${YELLOW}🐧 TESTANDO NO LINUX${NC}"
    echo -e "${YELLOW}========================================\n${NC}"
    
    local test_dir="/tmp/pegno-test-linux-$(date +%Y%m%d-%H%M%S)"
    
    write_step "Criando diretório de teste..."
    mkdir -p "$test_dir"
    cd "$test_dir"
    write_success "Diretório criado: $test_dir"
    
    write_step "Criando projeto Vite..."
    bun create vite test-app --template react-ts
    cd test-app
    write_success "Projeto Vite criado"
    
    write_step "Instalando Tailwind com Pegno..."
    node "$SCRIPT_DIR/dist/pegno.js" install tailwindcss postcss autoprefixer
    
    if [ ! -d "node_modules/tailwindcss" ]; then
        write_failure "Tailwind não foi instalado"
        return 1
    fi
    write_success "Tailwind instalado"
    
    write_step "Inicializando Tailwind..."
    bunx tailwindcss init -p
    
    if [ ! -f "tailwind.config.js" ]; then
        write_failure "Tailwind config não foi criado"
        return 1
    fi
    write_success "Tailwind inicializado"
    
    write_step "Instalando dependências Shadcn com Pegno..."
    node "$SCRIPT_DIR/dist/pegno.js" install class-variance-authority clsx tailwind-merge lucide-react --dev
    node "$SCRIPT_DIR/dist/pegno.js" install @radix-ui/react-slot
    write_success "Dependências Shadcn instaladas"
    
    write_step "Verificando instalações..."
    local packages=(
        "tailwindcss"
        "postcss"
        "autoprefixer"
        "class-variance-authority"
        "clsx"
        "tailwind-merge"
        "lucide-react"
        "@radix-ui/react-slot"
    )
    
    for pkg in "${packages[@]}"; do
        if [ -d "node_modules/$pkg" ]; then
            write_success "$pkg instalado"
        else
            write_failure "$pkg NÃO instalado"
            return 1
        fi
    done
    
    write_step "Testando build..."
    bun run build
    
    if [ ! -d "dist" ]; then
        write_failure "Build falhou"
        return 1
    fi
    write_success "Build executado com sucesso"
    
    echo -e "\n${GREEN}🎉 TESTE LINUX PASSOU!${NC}"
    cd "$SCRIPT_DIR"
    return 0
}

# Main
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${MAGENTA}"
cat << "EOF"

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🧪 TESTE DE INTEGRAÇÃO PEGNO                           ║
║   Vite + Shadcn + Tailwind                               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

EOF
echo -e "${NC}"

# Verificar se Pegno está buildado
if [ ! -f "$SCRIPT_DIR/dist/pegno.js" ]; then
    write_failure "Pegno não está buildado. Execute: bun run build"
    exit 1
fi

# Verificar se Bun está instalado
if ! command -v bun &> /dev/null; then
    write_failure "Bun não está instalado. Instale em: https://bun.sh"
    exit 1
fi

write_success "Bun $(bun --version) encontrado"

# Executar teste
if test_linux; then
    echo -e "\n${YELLOW}========================================${NC}"
    echo -e "${YELLOW}📊 RESUMO DOS TESTES${NC}"
    echo -e "${YELLOW}========================================\n${NC}"
    write_success "Linux: PASSOU"
    echo -e "\n${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
    exit 0
else
    echo -e "\n${YELLOW}========================================${NC}"
    echo -e "${YELLOW}📊 RESUMO DOS TESTES${NC}"
    echo -e "${YELLOW}========================================\n${NC}"
    write_failure "Linux: FALHOU"
    echo -e "\n${RED}⚠️ ALGUNS TESTES FALHARAM${NC}"
    exit 1
fi
