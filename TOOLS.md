# 🔧 Development Tools Guide - Clean Architecture API

Este guia documenta todas as ferramentas de desenvolvimento implementadas para melhorar a qualidade do código e padronizar o workflow.

## 🎯 **Visão Geral**

### **Ferramentas Implementadas**
- 🪝 **Husky** - Git hooks automáticos
- 🎨 **lint-staged** - Linting apenas em arquivos staged
- 📝 **Commitizen** - Commits padronizados
- ✅ **Commitlint** - Validação de mensagens de commit
- 🏷️ **Standard-version** - Releases automáticos
- ⚙️ **EditorConfig** - Configuração de editor
- 🔧 **VS Code** - Configurações e extensões
- 📋 **Makefile** - Comandos úteis

## 🪝 **Git Hooks com Husky**

### **Hooks Configurados**

#### **pre-commit**
Executado antes de cada commit:
```bash
🔍 Running pre-commit checks...
- Executa lint-staged nos arquivos modificados
- Roda testes para garantir que nada quebrou
✅ Pre-commit checks passed!
```

#### **commit-msg**
Valida a mensagem do commit:
```bash
🔍 Validating commit message...
- Verifica formato conventional commits
- Garante padrão de mensagens
✅ Commit message is valid!
```

#### **pre-push**
Executado antes de push:
```bash
🚀 Running pre-push checks...
- Executa suite completa de testes com coverage
- Faz build do projeto
- Executa linting completo
✅ Pre-push checks passed! Ready to push 🚀
```

### **Comandos Husky**
```bash
# Instalar hooks (automático no npm install)
npx husky install

# Adicionar novo hook
npx husky add .husky/pre-commit "npm test"

# Pular hooks (emergência)
git commit --no-verify
git push --no-verify
```

## 🎨 **Lint-staged**

### **Configuração**
```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write",
    "vitest related --run --reporter=verbose"
  ],
  "*.{js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write"
  ]
}
```

### **Funcionalidades**
- ✅ **Linting automático** apenas em arquivos modificados
- ✅ **Formatação automática** com Prettier
- ✅ **Testes relacionados** executados automaticamente
- ✅ **Performance otimizada** - apenas arquivos staged

### **Comandos**
```bash
# Executar manualmente
npx lint-staged

# Executar com debug
npx lint-staged --debug

# Executar sem stash
npx lint-staged --no-stash
```

## 📝 **Commitizen - Commits Padronizados**

### **Tipos de Commit**
```
✨ feat:     Nova funcionalidade
🐛 fix:      Correção de bug
📚 docs:     Documentação
💎 style:    Formatação (sem mudança de código)
📦 refactor: Refatoração de código
🚀 perf:     Melhoria de performance
🚨 test:     Adição ou correção de testes
🛠 build:    Mudanças no build system
⚙️ ci:       Mudanças no CI/CD
♻️ chore:    Outras mudanças
🗑 revert:   Reverter commit anterior
```

### **Como Usar**
```bash
# Commit interativo
npm run commit

# Retry último commit
npm run commit:retry

# Commit direto (não recomendado)
git commit -m "feat: add new feature"
```

### **Exemplo de Fluxo**
```bash
# 1. Fazer mudanças
git add .

# 2. Commit interativo
npm run commit

# 3. Seguir prompts:
? Select the type of change: ✨ feat
? What is the scope of this change: api
? Write a short description: add user authentication
? Provide a longer description: (opcional)
? Are there any breaking changes? No
? Does this change affect any open issues? No

# Resultado: feat(api): add user authentication
```

## ✅ **Commitlint - Validação de Commits**

### **Regras Configuradas**
```javascript
{
  "type-enum": ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "ci", "build", "revert"],
  "type-case": "lower-case",
  "type-empty": "never",
  "subject-case": "lower-case",
  "subject-empty": "never",
  "subject-full-stop": "never",
  "header-max-length": 100,
  "body-max-line-length": 100
}
```

### **Exemplos Válidos**
```bash
✅ feat: add user authentication
✅ fix(api): resolve login issue
✅ docs: update README with new features
✅ test: add unit tests for user service
✅ chore(deps): update dependencies
```

### **Exemplos Inválidos**
```bash
❌ Add user authentication (sem tipo)
❌ FEAT: add feature (tipo em maiúscula)
❌ feat: Add feature (subject em maiúscula)
❌ feat: add feature. (ponto final)
❌ feat: very long commit message that exceeds the maximum allowed length of 100 characters (muito longo)
```

## 🏷️ **Standard-version - Releases Automáticos**

### **Comandos de Release**
```bash
# Release automático (patch)
npm run release

# Release específico
npm run release:patch   # 1.0.0 -> 1.0.1
npm run release:minor   # 1.0.0 -> 1.1.0
npm run release:major   # 1.0.0 -> 2.0.0

# Dry run (visualizar mudanças)
npx standard-version --dry-run
```

### **O que o Release Faz**
1. 📊 **Analisa commits** desde a última tag
2. 📈 **Determina versão** baseado nos tipos de commit
3. 📝 **Gera CHANGELOG.md** automaticamente
4. 🏷️ **Cria tag Git** com a nova versão
5. 📦 **Atualiza package.json** com nova versão

### **Exemplo de CHANGELOG Gerado**
```markdown
# Changelog

## [1.2.0](https://github.com/user/repo/compare/v1.1.0...v1.2.0) (2023-12-01)

### ✨ Features
* add user authentication ([abc123](https://github.com/user/repo/commit/abc123))
* implement password reset ([def456](https://github.com/user/repo/commit/def456))

### 🐛 Bug Fixes
* resolve login timeout issue ([ghi789](https://github.com/user/repo/commit/ghi789))

### 📚 Documentation
* update API documentation ([jkl012](https://github.com/user/repo/commit/jkl012))
```

## ⚙️ **EditorConfig**

### **Configurações Aplicadas**
```ini
# Todos os arquivos
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

# TypeScript/JavaScript
max_line_length = 100

# Markdown
trim_trailing_whitespace = false
max_line_length = 120
```

### **Benefícios**
- ✅ **Consistência** entre diferentes editores
- ✅ **Formatação automática** de indentação
- ✅ **Padrão de quebras de linha** (LF)
- ✅ **Remoção de espaços** em branco

## 🔧 **VS Code - Configurações**

### **Settings Configurados**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.rulers": [80, 100],
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### **Extensões Recomendadas**
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",      // Formatação
    "dbaeumer.vscode-eslint",      // Linting
    "ms-vscode.vscode-typescript-next", // TypeScript
    "vitest.explorer",             // Testes Vitest
    "ms-azuretools.vscode-docker", // Docker
    "eamodio.gitlens",            // Git
    "usernamehw.errorlens",       // Erros inline
    "streetsidesoftware.code-spell-checker" // Spell check
  ]
}
```

### **Tasks Configuradas**
```json
{
  "label": "npm: start:dev",
  "type": "npm",
  "script": "start:dev",
  "group": { "kind": "build", "isDefault": true }
},
{
  "label": "npm: test:watch",
  "type": "npm",
  "script": "test:watch",
  "isBackground": true
}
```

### **Debug Configurations**
```json
{
  "name": "Debug NestJS",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/dist/main.js",
  "preLaunchTask": "npm: build"
},
{
  "name": "Debug Vitest Tests",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run", "--inspect-brk", "--no-coverage", "${relativeFile}"]
}
```

## 📋 **Makefile - Comandos Úteis**

### **Comandos de Desenvolvimento**
```bash
make help          # Mostrar todos os comandos
make install       # Instalar dependências
make dev           # Iniciar servidor de desenvolvimento
make build         # Build da aplicação
```

### **Comandos de Teste**
```bash
make test          # Executar todos os testes
make test-watch    # Testes em modo watch
make test-ui       # Abrir UI de testes
make test-cov      # Testes com coverage
```

### **Comandos de Qualidade**
```bash
make lint          # Executar linter
make lint-check    # Verificar linting sem corrigir
make format        # Formatar código
make validate      # Validação completa (lint + test + build)
```

### **Comandos Git**
```bash
make commit        # Commit interativo
make pre-commit    # Executar checks pre-commit manualmente
```

### **Comandos de Release**
```bash
make release       # Release automático
make release-minor # Release minor
make release-major # Release major
```

### **Comandos Docker**
```bash
make docker-build     # Build da imagem
make docker-up        # Iniciar containers
make docker-up-dev    # Iniciar ambiente de desenvolvimento
make docker-down      # Parar containers
make docker-logs      # Ver logs
make docker-clean     # Limpar sistema Docker
```

### **Comandos Rápidos**
```bash
make quick-start   # Início rápido para desenvolvimento
make quick-test    # Teste rápido
make quick-check   # Verificação rápida de qualidade
```

## 🚀 **Workflow Recomendado**

### **1. Desenvolvimento Diário**
```bash
# Iniciar desenvolvimento
make dev

# Fazer mudanças no código...

# Commit (automático: lint + test)
make commit

# Push (automático: full validation)
git push
```

### **2. Antes de Pull Request**
```bash
# Validação completa
make validate

# Verificar se tudo está ok
make quick-check

# Criar PR
```

### **3. Release**
```bash
# Verificar mudanças
npx standard-version --dry-run

# Fazer release
make release

# Push tags
git push --follow-tags
```

## 🔍 **Troubleshooting**

### **Problemas Comuns**

#### **Git Hooks não executam**
```bash
# Reinstalar hooks
npx husky install

# Verificar permissões
chmod +x .husky/*
```

#### **Lint-staged falha**
```bash
# Debug
npx lint-staged --debug

# Executar manualmente
npm run lint
npm test
```

#### **Commitizen não funciona**
```bash
# Verificar configuração
cat package.json | grep commitizen

# Reinstalar
npm install --save-dev commitizen cz-conventional-changelog
```

#### **VS Code não aplica configurações**
```bash
# Recarregar VS Code
Ctrl+Shift+P -> "Developer: Reload Window"

# Verificar extensões
Ctrl+Shift+X -> Verificar se extensões estão instaladas
```

### **Comandos de Diagnóstico**
```bash
# Verificar configuração Git
git config --list

# Verificar hooks
ls -la .husky/

# Verificar dependências
npm list --depth=0

# Verificar configuração ESLint
npx eslint --print-config src/main.ts
```

## 📊 **Métricas e Benefícios**

### **Antes vs Depois**
```
Métrica                    | Antes    | Depois   | Melhoria
---------------------------|----------|----------|----------
Commits padronizados       | 0%       | 100%     | +100%
Código formatado           | Manual   | Auto     | +∞
Testes antes commit        | Manual   | Auto     | +100%
Releases documentados      | Manual   | Auto     | +100%
Configuração de editor     | Manual   | Auto     | +100%
```

### **Benefícios Alcançados**
- ✅ **Qualidade consistente** do código
- ✅ **Commits padronizados** e rastreáveis
- ✅ **Releases automáticos** com changelog
- ✅ **Configuração unificada** entre desenvolvedores
- ✅ **Workflow otimizado** com comandos úteis
- ✅ **Prevenção de bugs** com hooks automáticos

---

**Status**: 🔧 **Ferramentas Implementadas** | 🚀 **Workflow Otimizado** | 📈 **Qualidade Garantida**
