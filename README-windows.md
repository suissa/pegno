# p3g - Windows Edition 🪟

Gerenciador global de dependências para Bun, otimizado para Windows.

## 🚀 Instalação Rápida

### Opção 1: Script Automático (Recomendado)

```powershell
# Clone o repositório
git clone https://github.com/seu-usuario/p3g.git
cd p3g

# Execute o instalador
.\install-windows.ps1 -Global
```

### Opção 2: Manual

```powershell
# Instale o Bun (se ainda não tiver)
irm bun.sh/install.ps1 | iex

# Clone e instale
git clone https://github.com/seu-usuario/p3g.git
cd p3g
bun install
bun build p3g.ts --outdir dist --target bun

# Adicione ao PATH manualmente ou use diretamente
.\dist\p3g.js --help
```

## 🎯 Diferenças no Windows

### Modo Cópia por Padrão

No Windows, o p3g usa **modo cópia** por padrão em vez de symlinks, pois:

- Symlinks requerem privilégios administrativos ou modo desenvolvedor
- Modo cópia é mais compatível e confiável
- Funciona em qualquer configuração do Windows

```powershell
# Modo padrão (cópia)
p3g axios@latest

# Forçar symlinks (requer privilégios)
p3g axios@latest --symlink
```

### Binários Executáveis

O p3g cria automaticamente wrappers `.cmd` e `.ps1` para binários de pacotes:

```powershell
# Após instalar um pacote com CLI
p3g typescript

# Os binários ficam disponíveis
.\node_modules\.bin\tsc.cmd --version
.\node_modules\.bin\tsc.ps1 --version
```

### Workspace Global

O workspace é criado em:

```
%USERPROFILE%\.p3g_workspace\
├── js\              # Pacotes globais
└── presets\         # Mini-workspaces salvos
```

Você pode customizar com a variável de ambiente:

```powershell
$env:p3g_WORKSPACE = "D:\dev\p3g_cache"
```

## 📖 Uso Básico

### Instalar Pacotes

```powershell
# Instalar pacote único
p3g axios@latest

# Instalar como devDependency
p3g --dev vitest

# Instalar múltiplos
p3g axios fastify zod

# Instalar tudo do package.json
p3g
```

### Mini-Workspaces

```powershell
# Salvar configuração atual
p3g axios fastify
# Responda 'y' quando perguntado

# Usar mini-workspace salvo
p3g use api

# Listar mini-workspaces
p3g list
```

### Sincronização

```powershell
# Copiar todo workspace para node_modules
p3g sync
```

## 🔧 Configuração Avançada

### Habilitar Symlinks (Opcional)

Para usar symlinks no Windows:

1. **Opção A: Modo Desenvolvedor**
   - Abra Configurações
   - Vá em "Atualização e Segurança" > "Para desenvolvedores"
   - Ative "Modo de desenvolvedor"

2. **Opção B: Executar como Administrador**
   ```powershell
   # Execute PowerShell como Admin
   p3g axios@latest --symlink
   ```

3. **Opção C: Política de Grupo (Windows Pro)**
   ```powershell
   # Execute como Admin
   New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" `
                    -Name "AllowDevelopmentWithoutDevLicense" `
                    -PropertyType DWORD `
                    -Value 1
   ```

### Variáveis de Ambiente

```powershell
# PowerShell (sessão atual)
$env:p3g_WORKSPACE = "D:\dev\p3g_cache"

# PowerShell (permanente)
[Environment]::SetEnvironmentVariable("p3g_WORKSPACE", "D:\dev\p3g_cache", "User")

# CMD
set p3g_WORKSPACE=D:\dev\p3g_cache
```

## 🐛 Troubleshooting

### Erro: "bun: command not found"

```powershell
# Reinstale o Bun
irm bun.sh/install.ps1 | iex

# Verifique o PATH
$env:PATH -split ';' | Select-String "bun"
```

### Erro: "Cannot create symbolic link"

Use modo cópia (padrão) ou habilite modo desenvolvedor:

```powershell
# Força modo cópia
p3g axios@latest --copy

# Ou habilite modo desenvolvedor (veja seção acima)
```

### Binários não funcionam

Verifique se os wrappers foram criados:

```powershell
# Liste os binários
dir .\node_modules\.bin\

# Execute com extensão explícita
.\node_modules\.bin\tsc.cmd --version
```

### Performance lenta

O modo cópia pode ser mais lento que symlinks. Para melhor performance:

1. Use SSD
2. Exclua `node_modules` do antivírus
3. Habilite modo desenvolvedor e use `--symlink`

## 🔄 Comparação: Cópia vs Symlink

| Aspecto | Modo Cópia (Padrão) | Modo Symlink |
|---------|---------------------|--------------|
| Privilégios | Não requer | Requer admin/dev mode |
| Compatibilidade | 100% | ~80% |
| Performance | Moderada | Rápida |
| Espaço em disco | Maior | Menor |
| Atualizações | Manual | Automática |

## 📊 Comandos Úteis

```powershell
# Ver ajuda completa
p3g --help

# Modo verbose (debug)
p3g axios@latest --verbose

# Limpar cache
Remove-Item -Recurse -Force "$env:USERPROFILE\.p3g_workspace"

# Ver workspace
explorer "$env:USERPROFILE\.p3g_workspace"
```

## 🎓 Exemplos Práticos

### Setup de Projeto API

```powershell
# Crie um novo projeto
mkdir minha-api
cd minha-api
bun init -y

# Instale dependências
p3g fastify @fastify/cors dotenv

# Salve como preset
# (responda 'y' e nomeie como 'api')

# Em outro projeto
cd ..\outro-projeto
p3g use api
```

### Setup de Projeto Frontend

```powershell
# Instale ferramentas de dev
p3g --dev vite typescript @types/node

# Instale libs de produção
p3g react react-dom

# Salve como preset 'frontend'
```

## 🔗 Links Úteis

- [Documentação do Bun](https://bun.sh/docs)
- [Issues do p3g](https://github.com/seu-usuario/p3g/issues)
- [Modo Desenvolvedor Windows](https://learn.microsoft.com/windows/apps/get-started/enable-your-device-for-development)

## 💡 Dicas

1. **Use PowerShell 7+** para melhor experiência
2. **Exclua node_modules do antivírus** para melhor performance
3. **Use SSD** para operações de cópia mais rápidas
4. **Mantenha o Bun atualizado**: `bun upgrade`

## 🤝 Contribuindo

Encontrou um bug específico do Windows? Abra uma issue com:

- Versão do Windows
- Versão do Bun
- Comando executado
- Erro completo

---

Feito com ❤️ para a comunidade Windows + Bun