document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const header = document.querySelector('.header');
    
    // Header scroll effect
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Keep header fixed on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 0) {
            header.style.transform = 'translateY(0)';
        } else {
            header.style.transform = 'translateY(0)';
        }
    });
    
    // Mobile menu toggle
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            const isActive = menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(20);
            }
        });
    }
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (nav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });
    
    // Smooth scrolling navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active navigation based on scroll
    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    
    // Remover interações de card - sem notificações
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Scroll animations
    const animateElements = document.querySelectorAll('.produto-item, .passo-item, .whatsapp-card-pix-style, .pix-card-novo, .maps-wrapper');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => animationObserver.observe(el));
    
    // PIX key click to copy
    const pixKey = document.querySelector('.pix-key');
    if (pixKey) {
        pixKey.addEventListener('click', copiarPix);
        pixKey.style.cursor = 'pointer';
    }
});

// WhatsApp order function
function pedirWhatsApp(produto, preco) {
    const numero = '5548988030687';
    const mensagem = `Olá! Gostaria de fazer um pedido de ${produto} (${preco}).`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
    window.open(url, '_blank');
}

// ===== CARROSSEL INFINITO SUAVE =====
class SmoothInfiniteCarousel {
    constructor() {
        this.carousel = document.getElementById('passosCarousel');
        if (!this.carousel) return;
        
        this.originalSlides = Array.from(this.carousel.querySelectorAll('.passo-item'));
        this.totalSlides = this.originalSlides.length;
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.visibleSlides = window.innerWidth <= 768 ? 1 : 2;
        this.totalDots = window.innerWidth <= 768 ? 4 : 2;
        
        this.init();
    }
    
    init() {
        this.cloneSlides();
        this.calculateDimensions();
        this.createDots();
        this.setupEventListeners();
        // Posicionar no primeiro slide real (após os clones)
        this.setPosition(this.totalSlides, false);
        this.updateDots();
    }
    
    cloneSlides() {
        // Clonar slides: adicionar cópias antes e depois
        this.originalSlides.forEach(slide => {
            const cloneBefore = slide.cloneNode(true);
            const cloneAfter = slide.cloneNode(true);
            this.carousel.insertBefore(cloneBefore, this.carousel.firstChild);
            this.carousel.appendChild(cloneAfter);
        });
    }
    
    calculateDimensions() {
        const slides = this.carousel.querySelectorAll('.passo-item');
        if (slides.length > 0) {
            const gap = parseFloat(getComputedStyle(this.carousel).gap) || 0;
            this.slideWidth = slides[0].offsetWidth + gap;
        }
    }
    
    createDots() {
        const dotsContainer = document.querySelector('.carousel-dots');
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalDots; i++) {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Grupo ${i + 1}`);
            dot.addEventListener('click', () => this.goToGroup(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    setupEventListeners() {
        const prevBtn = document.querySelector('.carousel-nav-prev');
        const nextBtn = document.querySelector('.carousel-nav-next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.navigate(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigate(1));
        
        // Listener para detectar fim da transição
        this.carousel.addEventListener('scrollend', () => this.handleScrollEnd());
        
        // Fallback para navegadores sem scrollend
        let scrollTimeout;
        this.carousel.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (!this.isTransitioning) {
                    this.handleScrollEnd();
                }
            }, 150);
        });
        
        // Resize
        window.addEventListener('resize', () => {
            this.visibleSlides = window.innerWidth <= 768 ? 1 : 2;
            this.totalDots = window.innerWidth <= 768 ? 4 : 2;
            this.calculateDimensions();
            this.createDots();
            this.setPosition(this.currentIndex + this.totalSlides, false);
            this.updateDots();
        });
    }
    
    navigate(direction) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Calcular próximo índice
    if (direction === 1) {
            this.currentIndex = (this.currentIndex + this.visibleSlides) % this.totalSlides;
    } else {
            this.currentIndex = (this.currentIndex - this.visibleSlides + this.totalSlides) % this.totalSlides;
        }
        
        // Calcular posição atual no carrossel (com clones)
        const currentPosition = Math.round(this.carousel.scrollLeft / this.slideWidth);
        const targetPosition = currentPosition + (direction * this.visibleSlides);
        
        // Navegar com animação
        this.setPosition(targetPosition, true);
        
        if (navigator.vibrate) navigator.vibrate(20);
    }
    
    goToGroup(groupIndex) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Calcular índice real baseado no grupo clicado
        let targetRealIndex;
        if (this.totalDots === 2) {
            // Desktop: cada grupo tem 2 slides
            targetRealIndex = groupIndex * 2;
        } else {
            // Mobile: cada grupo é 1 slide
            targetRealIndex = groupIndex;
        }
        
        // Atualizar o índice atual
        this.currentIndex = targetRealIndex;
        
        // Calcular posição no carrossel incluindo os clones
        // Precisamos ir para o slide real (não clone)
        const targetPosition = targetRealIndex + this.totalSlides;
        
        // Navegar diretamente para a posição
        this.setPosition(targetPosition, true);
        
        if (navigator.vibrate) navigator.vibrate(20);
    }
    
    setPosition(index, smooth = true) {
        const targetScroll = index * this.slideWidth;
        
        this.carousel.scrollTo({
            left: targetScroll,
            behavior: smooth ? 'smooth' : 'instant'
        });
        
        this.updateDots();
    }
    
    handleScrollEnd() {
        const scrollPosition = this.carousel.scrollLeft;
        const currentSlideIndex = Math.round(scrollPosition / this.slideWidth);
        
        // Verificar se está nos clones e reposicionar instantaneamente
        if (currentSlideIndex < this.totalSlides) {
            // Está nos clones do início - pular para o final correspondente
            const realIndex = currentSlideIndex;
            const newPosition = realIndex + this.totalSlides;
            this.carousel.scrollTo({
                left: newPosition * this.slideWidth,
                behavior: 'instant'
            });
            this.currentIndex = realIndex;
        } else if (currentSlideIndex >= this.totalSlides * 2) {
            // Está nos clones do fim - pular para o início correspondente
            const realIndex = currentSlideIndex - (this.totalSlides * 2);
            const newPosition = realIndex + this.totalSlides;
            this.carousel.scrollTo({
                left: newPosition * this.slideWidth,
                behavior: 'instant'
            });
            this.currentIndex = realIndex;
        } else {
            // Está nos slides reais - calcular índice correto
            this.currentIndex = currentSlideIndex - this.totalSlides;
        }
        
        // Garantir que o índice esteja dentro do range correto
        this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.totalSlides - 1));
        
        this.isTransitioning = false;
        this.updateDots();
    }
    
    updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        
        // Garantir que currentIndex está no range correto
        const safeIndex = Math.max(0, Math.min(this.currentIndex, this.totalSlides - 1));
        
        let activeGroupIndex;
        if (this.totalDots === 2) {
            // Desktop: cada grupo representa 2 slides
            activeGroupIndex = Math.floor(safeIndex / 2);
                } else {
            // Mobile: cada grupo representa 1 slide
            activeGroupIndex = safeIndex;
        }
        
        // Garantir que activeGroupIndex está no range dos dots
        activeGroupIndex = Math.max(0, Math.min(activeGroupIndex, this.totalDots - 1));
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeGroupIndex);
        });
        
        // Atualizar contador
        this.updateCounter();
    }
    
    updateCounter() {
        const counter = document.getElementById('carouselCounter');
        if (counter) {
            // Garantir que o display está no range correto
            const safeIndex = Math.max(0, Math.min(this.currentIndex, this.totalSlides - 1));
            
            if (this.visibleSlides === 2) {
                // Desktop: mostra 2 por vez, então conta em grupos
                const currentGroup = Math.floor(safeIndex / 2) + 1;
                const totalGroups = Math.ceil(this.totalSlides / 2);
                counter.textContent = `${currentGroup} / ${totalGroups}`;
            } else {
                // Mobile: mostra 1 por vez
                const currentDisplay = safeIndex + 1;
                counter.textContent = `${currentDisplay} / ${this.totalSlides}`;
            }
        }
    }
}

// Inicializar carrossel
let smoothCarousel;

document.addEventListener('DOMContentLoaded', function() {
    smoothCarousel = new SmoothInfiniteCarousel();
});

// Copy PIX function - Feedback visual aprimorado - Updated 2025-01-27
function copiarPix() {
    const chavePix = '48988030687';
    console.log('Copiando PIX:', chavePix);
    console.log('Valor esperado: 48988030687');
    const button = document.getElementById('btnCopyPix');
    
    if (!button) {
        console.error('Botão de copiar não encontrado');
        return;
    }
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(chavePix).then(() => {
            showCopySuccess(button);
        }).catch((err) => {
            console.error('Erro ao copiar:', err);
            fallbackCopyTextToClipboard(chavePix, button);
        });
    } else {
        fallbackCopyTextToClipboard(chavePix, button);
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function showCopySuccess(button) {
    // Adicionar classe de copiado
    button.classList.add('copied');
    
    // Mudar conteúdo do botão
    const buttonText = button.querySelector('.btn-copy-text');
    const buttonIcon = button.querySelector('svg path');
    
    if (buttonText) {
        buttonText.textContent = 'Copiado!';
    }
    
    if (buttonIcon) {
        buttonIcon.setAttribute('d', 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z');
    }
    
    // Reverter após 2 segundos
    setTimeout(() => {
        button.classList.remove('copied');
        if (buttonText) {
            buttonText.textContent = 'Copiar';
        }
        if (buttonIcon) {
            buttonIcon.setAttribute('d', 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z');
        }
    }, 2000);
}

// Fallback copy function
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        if (button) {
            showCopySuccess(button);
        }
    } catch (err) {
        console.error('Erro ao copiar:', err);
        if (button) {
            const buttonText = button.querySelector('.btn-copy-text');
            if (buttonText) {
                const originalText = buttonText.textContent;
                buttonText.textContent = 'Erro';
                setTimeout(() => {
                    buttonText.textContent = originalText;
                }, 2000);
            }
        }
    }
    
    document.body.removeChild(textArea);
}

// Generate QR Code visual
function gerarQRCode() {
    const qrPlaceholder = document.querySelector('.qr-pattern');
    if (qrPlaceholder) {
        qrPlaceholder.style.background = `
            repeating-linear-gradient(
                0deg,
                var(--primary-color) 0px,
                var(--primary-color) 6px,
                white 6px,
                white 12px
            ),
            repeating-linear-gradient(
                90deg,
                var(--primary-color) 0px,
                var(--primary-color) 6px,
                white 6px,
                white 12px
            )
        `;
    }
}

// Mobile optimizations
function isMobile() {
    return window.innerWidth <= 768;
}

function otimizarMobile() {
    if (isMobile()) {
        // Reduce animations on slower devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.style.setProperty('--transition', 'none');
        }
        
        // Optimize scroll performance
        let ticking = false;
        function updateScroll() {
            // Optimized scroll logic
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
}

// Initialize optimizations
document.addEventListener('DOMContentLoaded', function() {
    gerarQRCode();
    otimizarMobile();
});

// Prevent double-tap zoom on iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Service Worker removido para evitar avisos desnecessários

// ===== SISTEMA DE MODAIS PROFISSIONAIS =====

// Dados dos produtos
const produtosData = {
    'banana': {
        nome: 'Rosca de Banana',
        descricao: 'Sabor tradicional com banana fresquinha. Massa macia e saborosa, perfeita para o café da manhã ou lanche da tarde.',
        preco: 'R$ 4,00',
        imagem: 'assets/images/banana/banana.png'
    },
    'nata': {
        nome: 'Rosca de Nata',
        descricao: 'Cremosa e irresistível, feita com nata pura. Uma experiência única de sabor e textura que derrete na boca.',
        preco: 'R$ 4,00',
        imagem: 'assets/images/nata/nata.png'
    },
    'calabresa': {
        nome: 'Rosca de Calabresa com Queijo',
        descricao: 'Saborosa combinação de calabresa e queijo. Perfeita para quem gosta de sabores marcantes e queijo derretido.',
        preco: 'R$ 5,00',
        imagem: 'assets/images/calabresa-com-queijo/calabresa-com-queijo.png'
    }
};

// Dados dos passos
const passosData = [
    {
        numero: 1,
        titulo: 'Aqueça o Forno a 200°C',
        descricao: 'Coloque a rosca no forno ou air fryer pré-aquecido a 200°C. Importante: mantenha o papel manteiga embaixo da rosca para evitar que grude e facilitar o manuseio.',
        imagem: 'assets/images/como-assar/passo1.png'
    },
    {
        numero: 2,
        titulo: 'Deixe Dourar em Cima',
        descricao: 'Aguarde até que a parte superior da rosca fique bem douradinha. Este processo leva aproximadamente 10 a 15 minutos, dependendo da potência do seu forno.',
        imagem: 'assets/images/como-assar/passo2.png'
    },
    {
        numero: 3,
        titulo: 'Vire a Rosca',
        descricao: 'Quando o topo estiver dourado, vire a rosca de cabeça para baixo com cuidado. A parte crua ficará para cima e ela começará a crescer, criando aquela textura macia por dentro.',
        imagem: 'assets/images/como-assar/passo3.png'
    },
    {
        numero: 4,
        titulo: 'Está Pronta!',
        descricao: 'Aguarde dourar também por baixo. Sua rosca estará inchada, macia e dourada dos dois lados. Está pronta para servir! Aproveite ainda quentinha.',
        imagem: 'assets/images/como-assar/passo4.png'
    }
];

// Abrir modal de produto
function abrirModalProduto(tipo) {
    const produto = produtosData[tipo];
    if (!produto) return;
    
    const modal = document.getElementById('modalProduto');
    document.getElementById('modalProdutoNome').textContent = produto.nome;
    document.getElementById('modalProdutoDesc').textContent = produto.descricao;
    document.getElementById('modalProdutoPreco').textContent = produto.preco;
    document.getElementById('modalProdutoImg').src = produto.imagem;
    document.getElementById('modalProdutoImg').alt = produto.nome;
    
    // Configurar botão de pedido
    const btnPedir = document.getElementById('modalProdutoBtnPedir');
    btnPedir.onclick = function() {
        pedirWhatsApp(produto.nome, produto.preco);
        fecharModal('modalProduto');
    };
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    
    // Salvar posição atual do scroll ANTES de fixar o body
    scrollPosition = window.scrollY;
    
    // Corrigir scroll no iPhone
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollPosition}px`;
    
    // Focar no modal para acessibilidade
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.focus();
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// Controle do passo atual
let passoAtualIndex = 0;

// Variável para armazenar a posição do scroll
let scrollPosition = 0;

// Abrir modal de passo
function abrirModalPasso(numero) {
    passoAtualIndex = numero - 1;
    
    const modal = document.getElementById('modalPasso');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    
    // Aguardar o modal estar visível antes de atualizar o conteúdo
    setTimeout(() => {
        atualizarPasso();
    }, 50);
    
    // Salvar posição atual do scroll
    scrollPosition = window.scrollY;
    
    // Corrigir scroll no iPhone
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollPosition}px`;
    
    // Focar no modal para acessibilidade
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.focus();
    }
    
    // Adicionar suporte a swipe/arrastar
    adicionarSwipeSupport();
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// Atualizar conteúdo do passo
function atualizarPasso() {
    const passo = passosData[passoAtualIndex];
    
    if (!passo) {
        console.error('Passo não encontrado para índice:', passoAtualIndex);
        return;
    }
    
    // Verificar se os elementos existem antes de tentar atualizá-los
    const tituloEl = document.getElementById('modalPassoTitulo');
    const descEl = document.getElementById('modalPassoDesc');
    const imgEl = document.getElementById('modalPassoImg');
    const passoAtualEl = document.getElementById('passoAtual');
    const passoTotalEl = document.getElementById('passoTotal');
    
    if (tituloEl) tituloEl.textContent = passo.titulo;
    if (descEl) descEl.textContent = passo.descricao;
    if (imgEl) {
        imgEl.src = passo.imagem;
        imgEl.alt = passo.titulo;
    }
    if (passoAtualEl) passoAtualEl.textContent = passo.numero;
    if (passoTotalEl) passoTotalEl.textContent = passosData.length;
    
    // Atualizar estado dos botões
    const btnAnterior = document.getElementById('btnPassoAnterior');
    const btnProximo = document.getElementById('btnPassoProximo');
    
    // Clonar ambos os botões para remover todos os event listeners antigos
    const btnAnteriorNovo = btnAnterior.cloneNode(true);
    const btnProximoNovo = btnProximo.cloneNode(true);
    btnAnterior.parentNode.replaceChild(btnAnteriorNovo, btnAnterior);
    btnProximo.parentNode.replaceChild(btnProximoNovo, btnProximo);
    
    // Obter novas referências
    const btnAnt = document.getElementById('btnPassoAnterior');
    const btnProx = document.getElementById('btnPassoProximo');
    
    // Configurar botão "Anterior" (sempre com mesmo comportamento)
    btnAnt.addEventListener('click', () => {
        navegarPasso(-1);
    });
    
    // Mostrar/esconder botões baseado no passo
    if (passoAtualIndex === passosData.length - 1) {
        // Último passo: mostrar botão "Concluir"
        btnAnt.classList.remove('hidden');
        btnProx.classList.remove('hidden');
        btnAnt.disabled = false;
        btnProx.disabled = false;
        
        // Transformar botão "Próximo" em "Concluir"
        btnProx.innerHTML = `
            Concluir
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
        `;
        
        // Adicionar comportamento de conclusão
        btnProx.addEventListener('click', function() {
            console.log('Botão concluir clicado - disparando confete');
            
            // Fechar modal ANTES do confete para vê-lo
            fecharModal('modalPasso');
            
            // Disparar confete após fechar
            setTimeout(() => {
                mostrarConfete();
            }, 100);
        });
    } else {
        // Outros passos: mostrar botões normais
        btnAnt.classList.remove('hidden');
        btnProx.classList.remove('hidden');
        
        // Desabilitar anterior no primeiro passo
        btnAnt.disabled = passoAtualIndex === 0;
        btnProx.disabled = false;
        
        // Texto sempre "Próximo"
        btnProx.innerHTML = `
            Próximo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
        `;
        
        // Adicionar listener para navegar
        btnProx.addEventListener('click', () => {
            navegarPasso(1);
        });
    }
}

// Efeito de confete
function mostrarConfete() {
    console.log('Função mostrarConfete chamada');
    const cores = ['#C17624', '#9E6132', '#3b401b', '#f4a460'];
    const quantidade = 25;
    
    // Criar confetes de forma mais visível
    for (let i = 0; i < quantidade; i++) {
        setTimeout(() => {
            const confete = document.createElement('div');
            confete.className = 'confetti';
            
            // Posição inicial aleatória no topo da tela
            const posX = Math.random() * window.innerWidth;
            confete.style.left = posX + 'px';
            confete.style.top = '0px';
            
            // Estilo do confete - MAIS VISÍVEL
            confete.style.background = cores[Math.floor(Math.random() * cores.length)];
            confete.style.width = (Math.random() * 10 + 6) + 'px'; // 6-16px (maior)
            confete.style.height = (Math.random() * 10 + 6) + 'px';
            confete.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            confete.style.opacity = '0.85'; // Mais visível
            
            // Animação
            const duracao = Math.random() * 1.5 + 2; // 2-3.5s (mais lento para ver melhor)
            confete.style.animation = `confetti-fall ${duracao}s ease-out forwards`;
            
            document.body.appendChild(confete);
            console.log('Confete', i + 1, 'adicionado ao DOM em:', confete.style.left);
            
            // Remover após animação completa
            setTimeout(() => {
                confete.remove();
            }, duracao * 1000 + 200);
        }, i * 30); // Delay escalonado de 30ms entre cada confete
    }
    
    console.log('Processo de criação de', quantidade, 'confetes iniciado!');
    
    // Haptic feedback suave
    if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
    }
}

// Navegar entre passos
function navegarPasso(direcao) {
    const novoIndex = passoAtualIndex + direcao;
    
    if (novoIndex >= 0 && novoIndex < passosData.length) {
        passoAtualIndex = novoIndex;
        
        // Animação de transição
        const img = document.getElementById('modalPassoImg');
        img.style.transform = direcao > 0 ? 'translateX(20px)' : 'translateX(-20px)';
        img.style.opacity = '0';
        
        setTimeout(() => {
            atualizarPasso();
            img.style.transform = 'translateX(0)';
            img.style.opacity = '1';
        }, 150);
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    }
}

// Adicionar suporte a swipe/arrastar
function adicionarSwipeSupport() {
    const container = document.getElementById('modalPassoImg');
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        container.style.transform = `translateX(${diff}px)`;
    });
    
    container.addEventListener('touchend', () => {
        if (!isDragging) return;
        const diff = currentX - startX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0 && passoAtualIndex > 0) {
                navegarPasso(-1);
            } else if (diff < 0 && passoAtualIndex < passosData.length - 1) {
                navegarPasso(1);
            }
        }
        
        container.style.transform = 'translateX(0)';
        isDragging = false;
    });
    
    // Suporte a mouse drag (desktop)
    container.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        container.style.cursor = 'grabbing';
    });
    
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
        const diff = currentX - startX;
        container.style.transform = `translateX(${diff}px)`;
    });
    
    container.addEventListener('mouseup', () => {
        if (!isDragging) return;
        const diff = currentX - startX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0 && passoAtualIndex > 0) {
                navegarPasso(-1);
            } else if (diff < 0 && passoAtualIndex < passosData.length - 1) {
                navegarPasso(1);
            }
        }
        
        container.style.transform = 'translateX(0)';
        container.style.cursor = 'grab';
        isDragging = false;
    });
    
    container.addEventListener('mouseleave', () => {
        if (isDragging) {
            container.style.transform = 'translateX(0)';
            container.style.cursor = 'grab';
            isDragging = false;
        }
    });
}

// Fechar modal
function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    
    // Restaurar estilos do body
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    
    // Restaurar scroll de forma suave para evitar "pulo"
    requestAnimationFrame(() => {
        window.scrollTo({
            top: scrollPosition,
            behavior: 'instant'
        });
    });
    
    // Remover foco do modal
    if (document.activeElement && modal.contains(document.activeElement)) {
        document.activeElement.blur();
    }
}

// Fechar modal ao clicar fora
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-backdrop')) {
        const modal = event.target.closest('.modal');
        if (modal) {
            fecharModal(modal.id);
        }
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        fecharModal('modalProduto');
        fecharModal('modalPasso');
    }
});

// Adicionar event listeners aos produtos
document.addEventListener('DOMContentLoaded', function() {
    // Produtos
    const produtoItems = document.querySelectorAll('.produto-item');
    produtoItems.forEach((item, index) => {
        const tipos = ['banana', 'nata', 'calabresa'];
        item.addEventListener('click', function(e) {
            // Não abrir modal se clicar no botão
            if (e.target.closest('.btn-pedir')) return;
            abrirModalProduto(tipos[index]);
        });
    });
    
    // Passos - Corrigir para mobile com distinção entre clique e arraste
    const passoItems = document.querySelectorAll('.passo-item');
    passoItems.forEach((item, index) => {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let hasMoved = false;
        
        // Função para determinar o número do passo baseado no conteúdo
        function getPassoNumber(element) {
            const passoNumero = element.querySelector('.passo-numero');
            if (passoNumero) {
                return parseInt(passoNumero.textContent);
            }
            // Fallback: usar o índice + 1, mas limitado a 4
            return Math.min(index + 1, 4);
        }
        
        // Touch start
        item.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            hasMoved = false;
        }, { passive: true });
        
        // Touch move
        item.addEventListener('touchmove', function(e) {
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const diffX = Math.abs(touchX - touchStartX);
            const diffY = Math.abs(touchY - touchStartY);
            
            // Se moveu mais de 10px, considerar como arraste
            if (diffX > 10 || diffY > 10) {
                hasMoved = true;
            }
        }, { passive: true });
        
        // Touch end - só abrir modal se não arrastou
        item.addEventListener('touchend', function(e) {
            const touchDuration = Date.now() - touchStartTime;
            
            // Só abrir se não moveu e foi um toque rápido (menos de 300ms)
            if (!hasMoved && touchDuration < 300) {
                e.preventDefault();
                e.stopPropagation();
                const passoNumber = getPassoNumber(item);
                abrirModalPasso(passoNumber);
            }
        });
        
        // Mouse click para desktop
        item.addEventListener('click', function(e) {
            // Verificar se não é touch device
            if (!('ontouchstart' in window)) {
                const passoNumber = getPassoNumber(item);
                abrirModalPasso(passoNumber);
            }
        });
    });


});