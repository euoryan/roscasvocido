# 🚀 Como Fazer Deploy no GitHub Pages

## Passo a Passo para Publicar o Site

### 1. Criar Repositório no GitHub
1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome do repositório: `roscasvocido` (ou qualquer nome)
4. Marque como "Public"
5. Clique em "Create repository"

### 2. Fazer Upload dos Arquivos
1. No seu computador, abra o terminal na pasta do projeto
2. Execute os comandos:

```bash
git init
git add .
git commit -m "Primeira versão do site RoscasVocido"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/roscasvocido.git
git push -u origin main
```

### 3. Configurar GitHub Pages
1. No repositório do GitHub, vá em "Settings"
2. Role até "Pages" no menu lateral
3. Em "Source", selecione "Deploy from a branch"
4. Escolha "main" como branch
5. Clique em "Save"

### 4. Acessar o Site
- O site estará disponível em: `https://SEU_USUARIO.github.io/roscasvocido`
- Pode levar alguns minutos para ficar online

## 📝 Personalizações Necessárias

### Atualizar Informações de Contato
No arquivo `index.html`, altere:
- Número do WhatsApp: `(11) 99999-9999`
- Chave PIX: `(11) 99999-9999`
- Instagram: `@roscasvocido`

### Adicionar QR Code Real
1. Gere um QR Code com a chave PIX
2. Substitua o placeholder no CSS pela imagem real
3. Salve a imagem em `assets/qr-code.png`

### Adicionar Fotos dos Produtos
1. Tire fotos das roscas
2. Salve em `assets/produtos/`
3. Atualize os caminhos no HTML

## 🔧 Comandos Úteis

```bash
# Ver status dos arquivos
git status

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição da mudança"

# Enviar para GitHub
git push
```

## 📱 Teste o Site
- Teste em diferentes dispositivos
- Verifique se todos os links funcionam
- Confirme se as informações de contato estão corretas
