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
    const mensagem = `Olá Cidiu, quero fazer um pedido de roscas disponivel no Cardápio do site`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
    window.open(url, '_blank');
}

// ===== CARROSSEL INFINITO SUAVE E PRECISO =====
class SmoothInfiniteCarousel {
    constructor() {
        this.carousel = document.getElementById('passosCarousel');
        if (!this.carousel) return;
        
        // Obter slides originais
        this.originalSlides = Array.from(this.carousel.querySelectorAll('.passo-item'));
        this.totalSlides = this.originalSlides.length;
        
        // Estado do carrossel
        this.currentIndex = 0; // Índice real (0-3)
        this.isTransitioning = false;
        this.slideWidth = 0;
        this.gap = 0;
        
        // Detectar se é mobile
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }
    
    init() {
        // Limpar clones anteriores se existirem
        this.cleanup();
        
        // Calcular dimensões
        this.calculateDimensions();
        
        // Criar clones para loop infinito
        this.createClones();
        
        // Criar dots
        this.createDots();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Posicionar no primeiro slide real (após os clones do início)
        this.goToSlide(0, false);
        
        // Atualizar UI
        this.updateUI();
    }
    
    cleanup() {
        // Remover todos os slides clonados
        const allSlides = this.carousel.querySelectorAll('.passo-item');
        allSlides.forEach((slide, index) => {
            if (index >= this.totalSlides) {
                slide.remove();
            }
        });
    }
    
    calculateDimensions() {
        if (this.originalSlides.length === 0) return;
        
        // Calcular gap
        const computedStyle = getComputedStyle(this.carousel);
        this.gap = parseFloat(computedStyle.gap) || 0;
        
        // Calcular largura do slide
        const firstSlide = this.originalSlides[0];
        this.slideWidth = firstSlide.offsetWidth + this.gap;
    }
    
    createClones() {
        // Clonar todos os slides e adicionar no início
        this.originalSlides.forEach((slide, index) => {
            const clone = slide.cloneNode(true);
            clone.classList.add('clone-start');
            this.carousel.insertBefore(clone, this.carousel.firstChild);
        });
        
        // Clonar todos os slides e adicionar no final
        this.originalSlides.forEach((slide, index) => {
            const clone = slide.cloneNode(true);
            clone.classList.add('clone-end');
            this.carousel.appendChild(clone);
        });
    }
    
    createDots() {
        const dotsContainer = document.querySelector('.carousel-dots');
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        
        // Sempre criar 4 dots (um para cada passo)
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Ir para passo ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i, true));
            dotsContainer.appendChild(dot);
        }
    }
    
    setupEventListeners() {
        // Botões de navegação
        const prevBtn = document.querySelector('.carousel-nav-prev');
        const nextBtn = document.querySelector('.carousel-nav-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigate(-1));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigate(1));
        }
        
        // Detectar fim do scroll para reposicionar
        let scrollTimeout;
        let isUserScrolling = false;
        
        this.carousel.addEventListener('scroll', () => {
            if (this.isTransitioning && !isUserScrolling) return;
            
            isUserScrolling = true;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScrollEnd();
                isUserScrolling = false;
            }, 150);
        });
        
        // Suporte para scrollend (navegadores modernos)
        if ('onscrollend' in window) {
            this.carousel.addEventListener('scrollend', () => {
                if (isUserScrolling) {
                    this.handleScrollEnd();
                    isUserScrolling = false;
                }
            });
        }
        
        // Resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= 768;
                
                if (wasMobile !== this.isMobile) {
                    this.calculateDimensions();
                    this.cleanup();
                    this.createClones();
                    this.goToSlide(this.currentIndex, false);
                } else {
                    this.calculateDimensions();
                    this.goToSlide(this.currentIndex, false);
                }
            }, 250);
        });
    }
    
    navigate(direction) {
        if (this.isTransitioning) return;
        
        // Calcular próximo índice com loop
        if (direction === 1) {
            // Próximo: incrementa e volta para 0 se passar do último
            this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        } else {
            // Anterior: decrementa e vai para o último se for menor que 0
            this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        }
        
        // Navegar para o slide
        this.goToSlide(this.currentIndex, true);
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }
    
    goToSlide(index, smooth = true) {
        if (this.isTransitioning && smooth) return;
        
        // Garantir que o índice está no range válido
        index = Math.max(0, Math.min(index, this.totalSlides - 1));
        this.currentIndex = index;
        
        // Recalcular dimensões antes de navegar (importante após resize)
        this.calculateDimensions();
        
        // Calcular posição: slides originais começam após os clones do início
        // Estrutura: [clones início] [slides originais] [clones fim]
        // Posição = índice do slide + número de slides originais (clones do início)
        const targetPosition = (index + this.totalSlides) * this.slideWidth;
        
        if (smooth) {
            this.isTransitioning = true;
        }
        
        // Scroll suave ou instantâneo
        this.carousel.scrollTo({
            left: targetPosition,
            behavior: smooth ? 'smooth' : 'instant'
        });
        
        // Atualizar UI imediatamente
        this.updateUI();
        
        // Se não for smooth, não precisa esperar transição
        if (!smooth) {
            this.isTransitioning = false;
        } else {
            // Aguardar fim da transição
            setTimeout(() => {
                this.isTransitioning = false;
            }, 500);
        }
    }
    
    handleScrollEnd() {
        if (this.isTransitioning) return;
        
        // Recalcular dimensões para garantir precisão
        this.calculateDimensions();
        
        const scrollLeft = this.carousel.scrollLeft;
        
        // Calcular índice do slide atual baseado na posição de scroll
        // Usar Math.round para pegar o slide mais próximo
        const slideIndex = Math.round(scrollLeft / this.slideWidth);
        
        // Verificar se está nos clones do início (índices 0 a totalSlides-1)
        if (slideIndex < this.totalSlides) {
            // Está nos clones do início, pular para o slide real correspondente no final
            const realIndex = slideIndex;
            const newPosition = (realIndex + this.totalSlides * 2) * this.slideWidth;
            
            // Reposicionar instantaneamente sem animação
            this.carousel.style.scrollBehavior = 'auto';
            this.carousel.scrollLeft = newPosition;
            this.carousel.style.scrollBehavior = '';
            
            this.currentIndex = realIndex;
            this.updateUI();
            this.isTransitioning = false;
            return;
        }
        
        // Verificar se está nos clones do final (índices >= totalSlides * 2)
        if (slideIndex >= this.totalSlides * 2) {
            // Está nos clones do final, pular para o slide real correspondente no início
            const realIndex = slideIndex - (this.totalSlides * 2);
            const newPosition = (realIndex + this.totalSlides) * this.slideWidth;
            
            // Reposicionar instantaneamente sem animação
            this.carousel.style.scrollBehavior = 'auto';
            this.carousel.scrollLeft = newPosition;
            this.carousel.style.scrollBehavior = '';
            
            this.currentIndex = realIndex;
            this.updateUI();
            this.isTransitioning = false;
            return;
        }
        
        // Está nos slides reais (índices totalSlides a totalSlides*2-1)
        // Calcular índice real subtraindo os clones do início
        const realIndex = slideIndex - this.totalSlides;
        this.currentIndex = Math.max(0, Math.min(realIndex, this.totalSlides - 1));
        this.updateUI();
        
        this.isTransitioning = false;
    }
    
    updateUI() {
        // Atualizar contador - sempre mostra o passo exato (1-4)
        const counter = document.getElementById('carouselCounter');
        if (counter) {
            const passoAtual = this.currentIndex + 1;
            counter.textContent = `${passoAtual} / ${this.totalSlides}`;
        }
        
        // Atualizar dots
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
}

// Inicializar carrossel
let smoothCarousel;

document.addEventListener('DOMContentLoaded', function() {
    smoothCarousel = new SmoothInfiniteCarousel();
});

// Copy PIX function - Feedback visual aprimorado - Updated 2025-01-27 - GitHub Pages Fix
function copiarPix() {
    const chavePix = '48988030687';
    console.log('=== PIX COPY DEBUG ===');
    console.log('Copiando PIX:', chavePix);
    console.log('Valor esperado: 48988030687');
    console.log('Timestamp:', new Date().toISOString());
    const button = document.getElementById('btnCopyPix');
    
    if (!button) {
        console.error('Botão de copiar não encontrado');
        return;
    }
    
    // Verificação adicional para garantir o valor correto
    if (chavePix !== '48988030687') {
        console.error('ERRO: Valor PIX incorreto!', chavePix);
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

// Função de teste para debug
function testarPix() {
    console.log('=== TESTE PIX ===');
    console.log('Valor atual:', '48988030687');
    console.log('Função copiarPix:', typeof copiarPix);
    copiarPix();
}

// Disponibilizar função de teste globalmente
window.testarPix = testarPix;

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
        titulo: 'Aqueça o Forno a 180°C',
        descricao: 'Coloque a rosca no forno ou air fryer pré-aquecido a 180°C. Importante: mantenha o papel manteiga embaixo da rosca para evitar que grude e facilitar o manuseio.',
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