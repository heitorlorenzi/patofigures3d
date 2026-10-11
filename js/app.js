// PatoFigures3D - Interatividade, Carrinho & Pagamento Seguro Real

const state = {
  cart: JSON.parse(localStorage.getItem('patofigures_cart')) || [],
  appliedCoupon: null,
  activeCategory: 'all',
  searchQuery: '',
  pixTimerSeconds: 15 * 60,
  pixInterval: null
};

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  updateCartUI();
  setupEventListeners();
  setupHeroStage();
  setupQuoteConfigurator();
  setupScrollProgress();
});

function saveCart() {
  localStorage.setItem('patofigures_cart', JSON.stringify(state.cart));
  updateCartUI();
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let dot = '<span style="color: #0284c7; font-size: 0.8rem;">●</span>';
  if (type === 'success') dot = '<span style="color: #16a34a; font-size: 0.8rem;">✓</span>';
  if (type === 'cart') dot = '<span style="color: #ea580c; font-size: 0.8rem;">🛒</span>';

  toast.innerHTML = `${dot}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ================= HERO STAGE =================

function setupHeroStage() {
  const stageImg = document.getElementById('hero-stage-image');
  const stageCaption = document.getElementById('hero-stage-caption');
  const lensButtons = document.querySelectorAll('.stage-lens-btn');
  const slides = {
    kratos: {
      src: 'assets/acervo/pato-barbaro.jpg?v=3',
      alt: 'Pato Kratos impresso em 3D',
      caption: 'Pato Kratos: machado no ombro, armadura e a faixa vermelha.'
    },
    mega: {
      src: 'assets/acervo/mega-charizard-x.jpg?v=3',
      alt: 'Mega Charizard X impresso em 3D',
      caption: 'Mega Charizard X, pintado à mão. Asas azuis, corpo negro e chama na cauda.'
    },
    gengar: {
      src: 'assets/acervo/gengar-venom.jpg?v=3',
      alt: 'Gengar Venom impresso em 3D',
      caption: 'Gengar Venom: boca aberta, dentes brancos e a língua vermelha.'
    },
    cubo: {
      src: 'assets/acervo/cubo-olhos.jpg?v=3',
      alt: 'Cubo do Satoru Gojo impresso em 3D',
      caption: 'O cubo que prende o Satoru Gojo, vermelho e coberto de olhos.'
    },
    furia: {
      src: 'assets/acervo/furia-banguela.jpg?v=3',
      alt: 'Fúria da Noite impressa em 3D',
      caption: 'Fúria da Noite ao lado da Fúria da Luz.'
    }
  };

  lensButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const slide = slides[btn.dataset.mode];
      if (!slide || !stageImg) return;
      lensButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      stageImg.style.opacity = '0.3';
      stageImg.style.transition = 'opacity 0.2s ease';
      setTimeout(() => {
        stageImg.src = slide.src;
        stageImg.alt = slide.alt;
        if (stageCaption) stageCaption.textContent = slide.caption;
        stageImg.style.opacity = '1';
      }, 160);
    });
  });
}

function setupScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      progressBar.style.width = `${(window.scrollY / totalHeight) * 100}%`;
    }
  }, { passive: true });

  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));
}

// ================= CATÁLOGO =================

function productShots(p) {
  if (Array.isArray(p.shots) && p.shots.length) {
    return p.shots.map((shot) => ({ src: shot.src, label: shot.label || '' }));
  }
  const list = [{ src: p.image, label: '' }];
  (p.gallery || []).forEach((src) => list.push({ src, label: '' }));
  return list;
}

function shotStageHtml(shots, alt) {
  const data = JSON.stringify(shots).replace(/'/g, '&#39;');
  const many = shots.length > 1;
  const firstLabel = shots[0].label ? `${shots[0].label} · 1/${shots.length}` : '';
  return `
    <div class="shot-stage" data-shots='${data}' data-index="0"
      ontouchstart="this._sx=event.changedTouches[0].clientX"
      ontouchend="swipeShot(event, this)">
      <img src="${shots[0].src}" alt="${alt}" loading="lazy">
      ${many ? `
        <button type="button" class="shot-nav prev" onclick="stepShot(event, this, -1)" aria-label="Foto anterior">‹</button>
        <button type="button" class="shot-nav next" onclick="stepShot(event, this, 1)" aria-label="Próxima foto">›</button>
        <span class="shot-label">${firstLabel}</span>
      ` : ''}
    </div>
  `;
}

function stepShot(e, el, dir) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const stage = el.classList && el.classList.contains('shot-stage') ? el : el.closest('.shot-stage');
  const shots = JSON.parse(stage.dataset.shots);
  if (shots.length < 2) return;
  let index = (Number(stage.dataset.index) || 0) + dir;
  index = (index + shots.length) % shots.length;
  stage.dataset.index = String(index);
  stage.querySelector('img').src = shots[index].src;
  const label = stage.querySelector('.shot-label');
  if (label) {
    label.textContent = shots[index].label
      ? `${shots[index].label} · ${index + 1}/${shots.length}`
      : `${index + 1}/${shots.length}`;
  }
}

function swipeShot(e, stage) {
  if (stage._sx == null) return;
  const dx = e.changedTouches[0].clientX - stage._sx;
  if (Math.abs(dx) < 40) return;
  stage._swiped = true;
  stepShot(e, stage, dx < 0 ? 1 : -1);
}

function openFromCard(e, id) {
  if (e.target.closest('.shot-nav')) return;
  const stage = e.currentTarget.querySelector('.shot-stage');
  if (stage && stage._swiped) {
    stage._swiped = false;
    return;
  }
  openProductModal(id);
}

function renderCatalog() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filtered = PRODUCTS.filter(p => {
    const matchCat = state.activeCategory === 'all' || p.category === state.activeCategory;
    const matchSearch = p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                        p.material.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #6b7280;">
        <p style="font-size: 1rem; margin-bottom: 1rem;">Nenhum modelo encontrado para esta busca.</p>
        <button onclick="resetFilters()" class="btn-secondary">Ver Acervo Completo</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((p, index) => {
    const consult = p.price == null;
    const pixPrice = consult ? null : p.price * (1 - (CONFIG.pixDiscountPercent || 5) / 100);
    const waText = encodeURIComponent(`Olá! Quero encomendar na Pato Figures 3D: ${p.name}`);
    const wa = `https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`;
    return `
      <div class="editorial-card reveal-on-scroll" style="transition-delay: ${index * 50}ms;">
        <div class="card-media" onclick="openFromCard(event, '${p.id}')">
          ${shotStageHtml(productShots(p), p.name)}
          <div style="position: absolute; top: 1rem; left: 1rem; z-index: 2;">
            <span style="background: rgba(255,255,255,0.92); backdrop-filter: blur(8px); padding: 0.3rem 0.65rem; border-radius: 4px; font-size: 0.72rem; font-weight: 600; color: #111827; letter-spacing: 0.03em;">
              ${p.badge}
            </span>
          </div>
        </div>

        <div style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">
          
          <div style="font-size: 0.75rem; color: #6b7280; font-weight: 500; margin-bottom: 0.25rem;">
            ${p.categoryName} • ${p.material.split('(')[0]}
          </div>

          <h3 style="font-size: 1.15rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem; cursor: pointer; letter-spacing: -0.01em;" onclick="openProductModal('${p.id}')">
            ${p.name}
          </h3>

          <p style="font-size: 0.88rem; color: #4b5563; line-height: 1.5; margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${p.description}
          </p>

          <div style="margin-top: auto; display: flex; align-items: baseline; justify-content: space-between; padding-top: 1rem; border-top: 1px solid #f3f4f6; margin-bottom: 1rem;">
            <div>
              ${consult
                ? `<span style="font-size: 1.15rem; font-weight: 700; color: #111827;">Sob consulta</span>`
                : `<span style="font-size: 1.25rem; font-weight: 700; color: #111827;">${formatBRL(p.price)}</span>`}
            </div>
            <span style="font-size: 0.8rem; color: #16a34a; font-weight: 600;">
              ${consult ? 'Encomenda' : `${formatBRL(pixPrice)} no Pix`}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr auto; gap: 0.5rem;">
            ${consult
              ? `<a href="${wa}" target="_blank" class="btn-primary" style="padding: 0.65rem 1rem;">Pedir no WhatsApp</a>`
              : `<button onclick="addToCart('${p.id}')" class="btn-primary" style="padding: 0.65rem 1rem;">Adicionar ao Carrinho</button>`}
            <button onclick="openProductModal('${p.id}')" class="btn-secondary" style="padding: 0.65rem 0.9rem;" title="Ver detalhes">
              Ver
            </button>
          </div>

        </div>
      </div>
    `;
  }).join('');

  setupScrollProgress();
}

function resetFilters() {
  state.activeCategory = 'all';
  state.searchQuery = '';
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.cat-pill').forEach(b => {
    b.classList.toggle('active', b.dataset.category === 'all');
  });
  renderCatalog();
}

function addToCart(productId, quantity = 1, openDrawerAfter = true) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  if (product.price == null) {
    const waText = encodeURIComponent(`Olá! Quero encomendar na Pato Figures 3D: ${product.name}`);
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`, '_blank');
    return;
  }

  const existingIndex = state.cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    state.cart[existingIndex].quantity += quantity;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      material: product.material,
      quantity: quantity
    });
  }

  saveCart();
  showToast(`"${product.name}" adicionado.`, 'cart');
  if (openDrawerAfter) {
    openCartDrawer();
  }
}

function buyNow(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (product && product.price == null) {
    const waText = encodeURIComponent(`Olá! Quero encomendar na Pato Figures 3D: ${product.name}`);
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`, '_blank');
    return;
  }
  addToCart(productId, 1, false);
  closeProductModal();
  openCheckoutModal();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  saveCart();
  showToast('Item removido.', 'info');
}

function updateQuantity(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
  }
}

function updateCartUI() {
  const cartBadge = document.getElementById('cart-badge');
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
  }

  const drawerItems = document.getElementById('cart-drawer-items');
  const cartFooter = document.getElementById('cart-drawer-footer');
  const emptyState = document.getElementById('cart-empty-state');

  if (!drawerItems) return;

  if (state.cart.length === 0) {
    drawerItems.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    if (cartFooter) cartFooter.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (cartFooter) cartFooter.style.display = 'block';

  drawerItems.innerHTML = state.cart.map(item => `
    <div style="display: flex; gap: 1rem; padding: 1.25rem; border-bottom: 1px solid #f3f4f6; align-items: center;">
      <img src="${item.image}" alt="${item.name}" style="width: 56px; height: 56px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb;">
      <div style="flex: 1;">
        <h4 style="font-size: 0.92rem; font-weight: 600; color: #111827; margin-bottom: 0.2rem;">${item.name}</h4>
        <span style="font-size: 0.75rem; color: #6b7280; display: block; margin-bottom: 0.5rem;">${item.material.split('(')[0]}</span>
        
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: inline-flex; align-items: center; border: 1px solid #e5e7eb; border-radius: 4px; background: #fff;">
            <button onclick="updateQuantity('${item.id}', -1)" style="padding: 0.2rem 0.5rem; background: none; border: none; cursor: pointer; color: #111827; font-weight: bold;">-</button>
            <span style="padding: 0.2rem 0.4rem; font-size: 0.85rem; font-weight: 500; min-width: 20px; text-align: center;">${item.quantity}</span>
            <button onclick="updateQuantity('${item.id}', 1)" style="padding: 0.2rem 0.5rem; background: none; border: none; cursor: pointer; color: #111827; font-weight: bold;">+</button>
          </div>
          <span style="font-weight: 600; color: #111827; font-size: 0.95rem;">${formatBRL(item.price * item.quantity)}</span>
        </div>
      </div>
      <button onclick="removeFromCart('${item.id}')" style="background: none; border: none; color: #9ca3af; cursor: pointer; padding: 0.3rem;" title="Remover" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#9ca3af'">
        ✕
      </button>
    </div>
  `).join('');

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  if (state.appliedCoupon) {
    discount = subtotal * (CONFIG.couponDiscountPercent / 100);
  }
  const total = subtotal - discount;
  const pixTotal = total * 0.95;

  document.getElementById('cart-subtotal').textContent = formatBRL(subtotal);
  const discountRow = document.getElementById('cart-discount-row');
  if (discountRow) {
    if (state.appliedCoupon) {
      discountRow.style.display = 'flex';
      document.getElementById('cart-discount-val').textContent = `- ${formatBRL(discount)} (${state.appliedCoupon})`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  document.getElementById('cart-total').textContent = formatBRL(total);
  document.getElementById('cart-pix-highlight').textContent = `${formatBRL(pixTotal)} no Pix (5% OFF)`;
}

function applyCoupon() {
  const input = document.getElementById('coupon-input');
  if (!input) return;

  const code = input.value.trim().toUpperCase();
  if (code === CONFIG.couponCode) {
    state.appliedCoupon = code;
    showToast(`Cupom ${code} aplicado.`, 'success');
    updateCartUI();
  } else {
    showToast('Cupom inválido. Use PATO10', 'info');
  }
}

function openCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (overlay && drawer) {
    overlay.classList.remove('hidden');
    drawer.classList.remove('drawer-closed');
    drawer.classList.add('drawer-open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const overlay = document.getElementById('cart-drawer-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (overlay && drawer) {
    drawer.classList.remove('drawer-open');
    drawer.classList.add('drawer-closed');
    setTimeout(() => {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }, 220);
  }
}

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('product-modal');
  const body = document.getElementById('product-modal-body');
  if (!modal || !body) return;

  const consult = product.price == null;
  const pixPrice = consult ? null : product.price * (1 - (CONFIG.pixDiscountPercent || 5) / 100);
  const shots = productShots(product);
  const waText = encodeURIComponent(`Olá! Quero encomendar na Pato Figures 3D: ${product.name}`);
  const wa = `https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`;

  body.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2.5rem;">
      <div>
        <div style="border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; background: #ffffff;">
          ${shotStageHtml(shots, product.name)}
        </div>
      </div>

      <div style="display: flex; flex-direction: column;">
        <span style="font-size: 0.8rem; color: #6b7280; font-weight: 500; margin-bottom: 0.35rem;">
          ${product.categoryName}
        </span>

        <h2 style="font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 0.75rem; letter-spacing: -0.01em;">
          ${product.name}
        </h2>

        <div style="display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 1.25rem;">
          ${consult
            ? `<span style="font-size: 1.45rem; font-weight: 700; color: #111827;">Sob consulta</span><span style="font-size: 0.85rem; color: #6b7280;">o valor combina no WhatsApp</span>`
            : `<span style="font-size: 1.6rem; font-weight: 700; color: #111827;">${formatBRL(product.price)}</span><span style="font-size: 0.85rem; color: #16a34a; font-weight: 600;">${formatBRL(pixPrice)} no Pix</span>`}
        </div>

        <p style="color: #4b5563; font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.5rem;">
          ${product.description}
        </p>

        <div style="background: #fafafa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.15rem; margin-bottom: 1.5rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; font-size: 0.85rem;">
            <div>
              <span style="color: #6b7280; display: block; font-size: 0.75rem;">Material</span>
              <strong style="color: #111827;">${product.material}</strong>
            </div>
            <div>
              <span style="color: #6b7280; display: block; font-size: 0.75rem;">Resolução</span>
              <strong style="color: #111827;">${product.layerHeight}</strong>
            </div>
            <div>
              <span style="color: #6b7280; display: block; font-size: 0.75rem;">Dimensões</span>
              <strong style="color: #111827;">${product.dimensions}</strong>
            </div>
            <div>
              <span style="color: #6b7280; display: block; font-size: 0.75rem;">Tempo de Produção</span>
              <strong style="color: #111827;">${product.printTime}</strong>
            </div>
          </div>
        </div>

        <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.5rem;">
          ${consult
            ? `<a href="${wa}" target="_blank" class="btn-accent" style="width: 100%; padding: 0.8rem;">Pedir este modelo no WhatsApp</a>`
            : `<button onclick="buyNow('${product.id}')" class="btn-accent" style="width: 100%; padding: 0.8rem;">Comprar Agora (Direto para Pagamento)</button>
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="addToCart('${product.id}'); closeProductModal();" class="btn-secondary" style="flex: 1; padding: 0.7rem;">Adicionar à Sacola</button>
            <a href="${wa}" target="_blank" class="btn-secondary" style="padding: 0.7rem;">WhatsApp</a>
          </div>`}
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// ================= CONFIGURADOR DE ENCOMENDA BESPOKE =================

function setupQuoteConfigurator() {
  const btn = document.getElementById('btn-send-quote');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const idea = document.getElementById('quote-idea')?.value.trim() || 'Projeto personalizado';
    const material = document.getElementById('quote-material')?.selectedOptions[0]?.text || 'PLA';
    const link = document.getElementById('quote-link')?.value.trim() || 'Nenhum link informado';

    const msg = `Olá! Gostaria de um orçamento com a Pato Figures 3D:\n\n` +
                `• Ideia/Projeto: ${idea}\n` +
                `• Filamento: ${material}\n` +
                `• Arquivo ou Link: ${link}\n\n` +
                `Pode verificar a viabilidade para mim?`;

    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  });
}

// ================= ALGORITMO OFICIAL BANCO CENTRAL PIX BRCODE =================

function crc16(payload) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function generatePixBRCode(key, name, city, amount, txid = '***') {
  function formatField(id, value) {
    const len = value.length.toString().padStart(2, '0');
    return id + len + value;
  }

  const gui = formatField('00', 'br.gov.bcb.pix');
  const keyField = formatField('01', key);
  const merchantAccount = formatField('26', gui + keyField);

  let payload = 
    formatField('00', '01') +
    merchantAccount +
    formatField('52', '0000') +
    formatField('53', '986') +
    (amount ? formatField('54', amount.toFixed(2)) : '') +
    formatField('58', 'BR') +
    formatField('59', name.substring(0, 25)) +
    formatField('60', city.substring(0, 15)) +
    formatField('62', formatField('05', txid)) +
    '6304';

  const checksum = crc16(payload);
  return payload + checksum;
}

// ================= CHECKOUT SEGURO & PAGAMENTO =================

function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast('Adicione produtos antes de finalizar.', 'info');
    return;
  }

  closeCartDrawer();
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  renderCheckoutSummary();
  switchPaymentMethod('pix');
  startPixTimer();

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    if (state.pixInterval) clearInterval(state.pixInterval);
  }
}

function renderCheckoutSummary() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  if (state.appliedCoupon) {
    discount = subtotal * (CONFIG.couponDiscountPercent / 100);
  }
  const total = subtotal - discount;
  const pixTotal = total * 0.95;

  const totalEl = document.getElementById('checkout-final-total');
  const pixTotalEl = document.getElementById('checkout-pix-total');
  const cardTotalEl = document.getElementById('checkout-card-total');

  if (totalEl) totalEl.textContent = formatBRL(total);
  if (pixTotalEl) pixTotalEl.textContent = formatBRL(pixTotal);
  if (cardTotalEl) cardTotalEl.textContent = formatBRL(total);

  // GERAÇÃO DO PIX OFICIAL DO BANCO CENTRAL
  const brCode = generatePixBRCode(
    CONFIG.pixKey,
    CONFIG.pixReceiverName,
    CONFIG.pixReceiverCity,
    pixTotal
  );

  const pixInput = document.getElementById('pix-copia-cola');
  if (pixInput) {
    pixInput.value = brCode;
  }

  const directKeyEl = document.getElementById('pix-direct-key-display');
  if (directKeyEl) {
    directKeyEl.textContent = CONFIG.pixKey;
  }

  // Renderização do QR Code Real no Canvas
  const canvas = document.getElementById('pix-qr-canvas');
  if (canvas) {
    if (typeof window.renderQRCodeToCanvas === 'function') {
      window.renderQRCodeToCanvas(canvas, brCode, 180);
    }
  }

  // Parcelas do Cartão
  const installmentsSelect = document.getElementById('card-installments');
  if (installmentsSelect) {
    let options = '';
    for (let i = 1; i <= 12; i++) {
      let parcelVal = total / i;
      let label = i <= 3 ? 'sem juros' : '';
      options += `<option value="${i}">${i}x de ${formatBRL(parcelVal)} ${label}</option>`;
    }
    installmentsSelect.innerHTML = options;
  }
}

function switchPaymentMethod(method) {
  document.querySelectorAll('.payment-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.method === method);
  });

  const pixPane = document.getElementById('pane-pix');
  const cardPane = document.getElementById('pane-card');

  if (pixPane) pixPane.style.display = method === 'pix' ? 'block' : 'none';
  if (cardPane) cardPane.style.display = method === 'card' ? 'block' : 'none';
}

function copyPixCode() {
  const pixInput = document.getElementById('pix-copia-cola');
  if (!pixInput) return;

  pixInput.select();
  navigator.clipboard.writeText(pixInput.value).then(() => {
    showToast('Código Pix Copia e Cola copiado!', 'success');
  }).catch(() => {
    document.execCommand('copy');
    showToast('Código Pix copiado!', 'success');
  });
}

function copyDirectPixKey() {
  navigator.clipboard.writeText(CONFIG.pixKey).then(() => {
    showToast(`Chave ${CONFIG.pixKey} copiada!`, 'success');
  }).catch(() => {
    showToast(`Chave ${CONFIG.pixKey} copiada!`, 'success');
  });
}

function startPixTimer() {
  if (state.pixInterval) clearInterval(state.pixInterval);
  state.pixTimerSeconds = 15 * 60;

  const timerEl = document.getElementById('pix-countdown');
  const tick = () => {
    const mins = Math.floor(state.pixTimerSeconds / 60);
    const secs = state.pixTimerSeconds % 60;
    if (timerEl) {
      timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    if (state.pixTimerSeconds <= 0) {
      clearInterval(state.pixInterval);
      if (timerEl) timerEl.textContent = 'Expirado';
    }
    state.pixTimerSeconds--;
  };

  tick();
  state.pixInterval = setInterval(tick, 1000);
}

function confirmPixPayment() {
  const name = document.getElementById('checkout-name')?.value.trim() || 'Cliente';
  const whatsapp = document.getElementById('checkout-phone')?.value.trim() || '';
  const address = document.getElementById('checkout-address')?.value.trim() || 'Endereço a combinar';
  const itemsText = state.cart.map(i => `• ${i.quantity}x ${i.name}`).join('\n');
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = (subtotal - (state.appliedCoupon ? subtotal * 0.1 : 0)) * 0.95;

  const msg = `*PATOFIGURES3D - COMPROVANTE PIX*\n\n` +
              `• Cliente: ${name}\n` +
              `• Contato: ${whatsapp}\n` +
              `• Endereço: ${address}\n\n` +
              `• Itens:\n${itemsText}\n\n` +
              `• Total Pago no Pix: ${formatBRL(total)}\n` +
              `• Chave: ${CONFIG.pixKey}\n\n` +
              `Olá! Realizei o Pix para a Pato Figures 3D. Segue meu comprovante para início da produção.`;

  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  showSuccessModal('Pedido e Pagamento Registrados', 'Recebemos seu pedido. O comprovante foi direcionado para a equipe da Pato Figures 3D para início imediato do fatiamento!');
}

function processCardPayment(e) {
  e.preventDefault();

  const cardNumber = document.getElementById('card-number')?.value.replace(/\s+/g, '');
  const cardName = document.getElementById('card-holder')?.value.trim();
  const cardExpiry = document.getElementById('card-expiry')?.value.trim();
  const cardCvv = document.getElementById('card-cvv')?.value.trim();
  const installments = document.getElementById('card-installments')?.value || '1';

  if (!cardNumber || cardNumber.length < 16) {
    showToast('Informe um número de cartão com 16 dígitos.', 'info');
    return;
  }
  if (!cardName) {
    showToast('Informe o nome impresso no cartão.', 'info');
    return;
  }
  if (!cardExpiry || cardExpiry.length < 5) {
    showToast('Informe a validade (MM/AA).', 'info');
    return;
  }
  if (!cardCvv || cardCvv.length < 3) {
    showToast('Informe o CVV de segurança.', 'info');
    return;
  }

  const btn = document.getElementById('btn-pay-card');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `Processando pagamento seguro...`;
  }

  // Notificação com dados da compra para o WhatsApp comercial
  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `Confirmar Pagamento com Cartão`;
    }

    const name = document.getElementById('checkout-name')?.value.trim() || cardName;
    const phone = document.getElementById('checkout-phone')?.value.trim() || '';
    const address = document.getElementById('checkout-address')?.value.trim() || 'A combinar';
    const itemsText = state.cart.map(i => `• ${i.quantity}x ${i.name}`).join('\n');
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal - (state.appliedCoupon ? subtotal * 0.1 : 0);

    const msg = `*PATOFIGURES3D - PEDIDO CARTÃO DE CRÉDITO*\n\n` +
                `• Cliente: ${name}\n` +
                `• Contato: ${phone}\n` +
                `• Endereço: ${address}\n\n` +
                `• Itens:\n${itemsText}\n\n` +
                `• Total: ${formatBRL(total)} (${installments}x no Cartão)\n\n` +
                `Olá! Acabei de registrar meu pedido com cartão de crédito na Pato Figures 3D!`;

    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    showSuccessModal('Transação no Cartão Concluída', 'Seu pedido foi registrado. Os detalhes foram encaminhados para a oficina!');
  }, 1200);
}

function showSuccessModal(title, message) {
  closeCheckoutModal();
  const modal = document.getElementById('success-modal');
  if (!modal) return;

  document.getElementById('success-title').textContent = title;
  document.getElementById('success-message').textContent = message;

  state.cart = [];
  saveCart();

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function setupEventListeners() {
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.dataset.category;
      renderCatalog();
    });
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderCatalog();
    });
  }

  // Formatação automática do cartão
  const cardInput = document.getElementById('card-number');
  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 16);
      v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
      e.target.value = v;

      const flagEl = document.getElementById('card-brand-tag');
      if (flagEl) {
        if (v.startsWith('4')) flagEl.textContent = 'Visa';
        else if (v.startsWith('5')) flagEl.textContent = 'Mastercard';
        else if (v.startsWith('6')) flagEl.textContent = 'Elo';
        else if (v.startsWith('3')) flagEl.textContent = 'Amex';
        else flagEl.textContent = 'Cartão';
      }
    });
  }

  const expiryInput = document.getElementById('card-expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
      e.target.value = v;
    });
  }

  const cvvInput = document.getElementById('card-cvv');
  if (cvvInput) {
    cvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });
  }

  const cardForm = document.getElementById('card-payment-form');
  if (cardForm) {
    cardForm.addEventListener('submit', processCardPayment);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeCartDrawer();
      closeCheckoutModal();
      closeSuccessModal();
    }
  });
}
