# 🦆 Pato 3D - Loja & Catálogo de Impressão 3D FDM

Plataforma oficial da **Pato 3D**, desenvolvida para apresentar seu trabalho com padrão de estúdio profissional e converter visitantes em clientes.

---

## 🚀 Como Visualizar a Página Agora

### Opção 1: Via Servidor Local (Recomendado)
O servidor local já foi iniciado e está rodando em segundo plano:
👉 **Acesse no seu navegador:** [http://localhost:3000](http://localhost:3000)

*(Se precisar iniciar o servidor manualmente no futuro, basta abrir o terminal nesta pasta e rodar: `python3 -m http.server 3000` ou `npx serve`)*.

### Opção 2: Abrir Diretamente no Navegador
Você também pode clicar duas vezes no arquivo `index.html` ou abrir o caminho:
👉 **http://localhost:3000**

---

## 🛠️ O que está Incluído

1. **Identidade Visual Marcante ("Efeito UAU"):**
   - Mascote oficial: O Pato 3D Low-Poly em alta resolução com iluminação temática cyan/laranja.
   - Design moderno com glassmorphism, modo escuro de alto contraste e tipografia limpa.

2. **Catálogo de Amostras FDM:**
   - 6 produtos modelados em filamentos nobres (PLA Silk com brilho metálico, PLA+ Matte, PETG de alta tenacidade e filamentos bicolores).
   - Fichas técnicas com altura de camada (0.12mm a 0.16mm), tempo de impressão e infill.
   - Filtros dinâmicos por categoria e busca em tempo real.

3. **Simulador Interativo de Orçamentos 3D:**
   - Formulário passo a passo onde o cliente escolhe o tipo de projeto, filamento, altura de camada, tamanho e preenchimento.
   - Opção para upload de arquivos STL / OBJ.
   - Botão **"Enviar Projeto para o WhatsApp da Oficina"** que monta automaticamente a mensagem estruturada com todas as especificações!

4. **Carrinho de Compras & Checkout Seguro:**
   - Gaveta lateral fluida com controle de quantidade e subtotal.
   - Cupom de desconto ativo: `PATO10` (aplica 10% OFF).
   - **PIX Instantâneo:** Desconto automático de 5%, geração de QR Code e código Copia-e-Cola com a chave oficial (`patofigures3d@gmail.com`).
   - **Cartão de Crédito:** Interface segura com detecção automática de bandeiras (Visa, Mastercard, Elo) e cálculo de parcelamento em até 12x.
   - **Fechamento via WhatsApp:** Exportação da compra completa para negociação direta no WhatsApp comercial.

5. **Prova Social e Credibilidade:**
   - Diferenciais técnicos da tecnologia FDM.
   - Passo a passo transparente do processo de fabricação e envio seguro anti-quebra.
   - Seção de depoimentos 5 estrelas e FAQ com respostas detalhadas.

---

## ⚙️ Como Personalizar Informações

Todas as configurações da loja estão centralizadas no topo do arquivo `js/products.js`:

```javascript
const CONFIG = {
  brandName: 'Pato 3D',
  tagline: 'Action Figures & Soluções em Impressão 3D FDM',
  pixKey: 'patofigures3d@gmail.com',        // Chave PIX oficial
  pixDiscountPercent: 5,                   // Desconto no PIX (%)
  couponCode: 'PATO10',                    // Código do cupom
  couponDiscountPercent: 10,               // Desconto do cupom (%)
  whatsappNumber: '5546988259042',         // (46) 98825-9042
  freeShippingAbove: 299.00
};
```

Para adicionar novos produtos, basta incluir novos blocos no array `PRODUCTS` dentro de `js/products.js` com as fotos na pasta `assets/`.
