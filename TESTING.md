# 🧪 Testes de Integração Pegno

Este documento descreve os testes de integração do Pegno para validar a instalação completa de stacks modernas de desenvolvimento.

## 📋 O Que é Testado

Os testes validam a capacidade do Pegno de instalar e configurar uma stack completa:

- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Shadcn/ui** - Componentes React reutilizáveis
- **Dependências relacionadas** - PostCSS, Autoprefixer, Radix UI, etc.

## 🎯 Ambientes Testados

### ✅ Windows

- Instalação nativa no Windows
- PowerShell como shell padrão
- Bun runtime

### ✅ WSL (Windows Subsystem for Linux)

- Ubuntu 22.04 no WSL
- Bash como shell
- Bun runtime no ambiente Linux

### ✅ Linux

- Distribuições Linux nativas
- Bash como shell
- Bun runtime

## 🚀 Como Executar os Testes

### Pré-requisitos

1. **Bun instalado** (>=1.1.0)

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Pegno buildado**
   ```bash
   bun run build
   ```

### Executar Todos os Testes

#### Windows + WSL

```powershell
bun run test:integration
# ou
pwsh -File test-integration.ps1 -All
```

#### Apenas Windows

```powershell
bun run test:integration:windows
# ou
pwsh -File test-integration.ps1 -Windows
```

#### Apenas WSL

```powershell
bun run test:integration:wsl
# ou
pwsh -File test-integration.ps1 -WSL
```

#### Linux Nativo

```bash
bun run test:integration:linux
# ou
bash test-integration.sh
```

## 📊 O Que os Testes Fazem

### 1. Preparação

- Cria diretório temporário de teste
- Inicializa projeto Vite com template React + TypeScript

### 2. Instalação Tailwind

```bash
pegno install tailwindcss postcss autoprefixer
bunx tailwindcss init -p
```

### 3. Instalação Shadcn Dependencies

```bash
pegno install class-variance-authority clsx tailwind-merge lucide-react --dev
pegno install @radix-ui/react-slot
```

### 4. Verificação

- Confirma que todos os pacotes estão em `node_modules/`
- Valida arquivos de configuração criados
- Executa build do projeto

### 5. Limpeza

- Remove diretórios temporários (opcional)

## 🔍 Estrutura dos Testes

### test-integration.ps1 (PowerShell)

```powershell
# Testa Windows e WSL
./test-integration.ps1 -All

# Testa apenas Windows
./test-integration.ps1 -Windows

# Testa apenas WSL
./test-integration.ps1 -WSL
```

### test-integration.sh (Bash)

```bash
# Testa Linux
./test-integration.sh
```

## 🤖 GitHub Actions

Os testes são executados automaticamente no CI/CD:

### Triggers

- Push para `main` ou `develop`
- Pull requests para `main`
- Agendamento semanal (segundas às 02:00)
- Execução manual via workflow_dispatch

### Workflow: `integration-test.yml`

```yaml
jobs:
  test-windows: # Testa no Windows nativo
  test-wsl: # Testa no WSL (Ubuntu)
  test-summary: # Gera resumo dos resultados
```

### Visualizar Resultados

1. Acesse a aba **Actions** no GitHub
2. Selecione o workflow **Integration Test - Vite + Shadcn + Tailwind**
3. Veja os logs detalhados de cada step

## 📦 Pacotes Verificados

Os testes confirmam a instalação de:

| Pacote                     | Tipo | Descrição                   |
| -------------------------- | ---- | --------------------------- |
| `tailwindcss`              | prod | Framework CSS               |
| `postcss`                  | prod | Processador CSS             |
| `autoprefixer`             | prod | Plugin PostCSS              |
| `class-variance-authority` | dev  | Utilitário para variantes   |
| `clsx`                     | dev  | Utilitário para classes CSS |
| `tailwind-merge`           | dev  | Merge de classes Tailwind   |
| `lucide-react`             | dev  | Ícones React                |
| `@radix-ui/react-slot`     | prod | Primitivo Radix UI          |

## ✅ Critérios de Sucesso

Um teste passa quando:

1. ✅ Todos os pacotes são instalados em `node_modules/`
2. ✅ Arquivos de configuração são criados (`tailwind.config.js`, `postcss.config.js`)
3. ✅ Build do Vite executa sem erros
4. ✅ Diretório `dist/` é criado com os arquivos buildados

## ❌ Troubleshooting

### Erro: "Pegno não está buildado"

```bash
bun run build
```

### Erro: "Bun não encontrado"

```bash
# Windows
irm bun.sh/install.ps1 | iex

# Linux/WSL
curl -fsSL https://bun.sh/install | bash
```

### Erro: "WSL não está disponível"

```powershell
# Habilitar WSL no Windows
wsl --install
```

### Erro: "Tailwind não foi instalado"

- Verifique se o Pegno está funcionando: `node dist/pegno.js --help`
- Verifique conectividade de rede
- Tente instalar manualmente: `bun add tailwindcss`

### Erro: "Build falhou"

- Verifique logs do Vite
- Confirme que todas as dependências foram instaladas
- Tente executar `bun install` manualmente

## 📈 Métricas

Os testes medem:

- ⏱️ **Tempo de execução** - Quanto tempo leva para instalar tudo
- 📦 **Tamanho do node_modules** - Espaço em disco usado
- ✅ **Taxa de sucesso** - Porcentagem de testes que passam
- 🔄 **Consistência** - Resultados idênticos em múltiplas execuções

## 🎯 Próximos Passos

Testes futuros podem incluir:

- [ ] Next.js + Shadcn + Tailwind
- [ ] Astro + Tailwind
- [ ] SvelteKit + Shadcn + Tailwind
- [ ] Remix + Tailwind
- [ ] Testes de performance (tempo de instalação)
- [ ] Testes de uso de disco (tamanho do cache global)
- [ ] Testes de sincronização entre projetos

## 📝 Contribuindo

Para adicionar novos testes:

1. Crie um novo script em `test-*.ps1` ou `test-*.sh`
2. Adicione ao `package.json` scripts
3. Crie workflow correspondente em `.github/workflows/`
4. Documente aqui no TESTING.md

## 🔗 Links Úteis

- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Bun Documentation](https://bun.sh/docs)
- [GitHub Actions Documentation](https://docs.github.com/actions)
