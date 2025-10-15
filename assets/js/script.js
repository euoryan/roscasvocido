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
    const numero = '554888030687';
    const mensagem = `Olá! Gostaria de fazer um pedido de ${produto} (${preco}).`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
    window.open(url, '_blank');
}

// ===== CARROSSEL COM ARRASTE =====
let currentSlideIndex = 0;
const carousel = document.getElementById('passosCarousel');
let isDown = false;
let startX;
let scrollLeft;

function updateCarouselDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    const slides = document.querySelectorAll('.passo-item');
    
    if (!carousel || slides.length === 0) return;
    
    // Calcular qual slide está visível
    const scrollPosition = carousel.scrollLeft;
    const slideWidth = slides[0].offsetWidth + parseFloat(getComputedStyle(carousel).gap);
    currentSlideIndex = Math.round(scrollPosition / slideWidth);
    
    // Atualizar dots
    dots.forEach((dot, index) => {
        if (index === currentSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function scrollPassos(direction) {
    if (!carousel) return;
    
    const slides = document.querySelectorAll('.passo-item');
    if (slides.length === 0) return;
    
    const slideWidth = slides[0].offsetWidth + parseFloat(getComputedStyle(carousel).gap);
    carousel.scrollBy({
        left: direction * slideWidth,
        behavior: 'smooth'
    });
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

function goToSlide(index) {
    if (!carousel) return;
    
    const slides = document.querySelectorAll('.passo-item');
    if (slides.length === 0) return;
    
    const slideWidth = slides[0].offsetWidth + parseFloat(getComputedStyle(carousel).gap);
    carousel.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
    });
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// Arrastar com mouse
if (carousel) {
    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.2;
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Atualizar dots ao scrollar
    carousel.addEventListener('scroll', () => {
        updateCarouselDots();
    });

    // Inicializar
    updateCarouselDots();
}

// Copy PIX function - Feedback direto no botão
function copiarPix() {
    const chavePix = '+55 48 8803-0687';
    const button = document.querySelector('.btn-copy-pix');
    
    if (!button) return;
    
    const originalHTML = button.innerHTML;
    const originalBg = button.style.background;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(chavePix).then(() => {
            showCopySuccess(button, originalHTML, originalBg);
        }).catch(() => {
            fallbackCopyTextToClipboard(chavePix, button, originalHTML, originalBg);
        });
    } else {
        fallbackCopyTextToClipboard(chavePix, button, originalHTML, originalBg);
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function showCopySuccess(button, originalHTML, originalBg) {
    button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        Copiado!
    `;
    button.style.background = '#4CAF50';
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = originalBg;
    }, 2500);
}

// Fallback copy function
function fallbackCopyTextToClipboard(text, button, originalHTML, originalBg) {
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
            showCopySuccess(button, originalHTML, originalBg);
        }
    } catch (err) {
        if (button) {
            button.innerHTML = 'Erro ao copiar';
            setTimeout(() => {
                button.innerHTML = originalHTML;
            }, 2000);
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

// Service Worker for caching (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado com sucesso');
            })
            .catch(function(err) {
                console.log('Falha no registro do ServiceWorker');
            });
    });
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData.loadEventEnd - perfData.loadEventStart > 3000) {
                console.log('Site carregado em:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        }, 0);
    });
}

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
    document.body.style.overflow = 'hidden';
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// Abrir modal de passo
function abrirModalPasso(numero) {
    const passo = passosData[numero - 1];
    if (!passo) return;
    
    const modal = document.getElementById('modalPasso');
    document.getElementById('modalPassoTitulo').textContent = passo.titulo;
    document.getElementById('modalPassoDesc').textContent = passo.descricao;
    document.getElementById('modalPassoImg').src = passo.imagem;
    document.getElementById('modalPassoImg').alt = passo.titulo;
    document.getElementById('modalPassoBadge').textContent = `Passo ${passo.numero}`;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// Fechar modal
function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Resetar zoom se houver
    const img = modal.querySelector('.modal-image');
    if (img && img.classList.contains('zoomed')) {
        img.classList.remove('zoomed');
    }
    
    // Resetar botões de zoom
    if (modalId === 'modalProduto') {
        document.getElementById('zoomInProduto').classList.remove('hidden');
        document.getElementById('zoomOutProduto').classList.add('hidden');
    } else if (modalId === 'modalPasso') {
        document.getElementById('zoomInPasso').classList.remove('hidden');
        document.getElementById('zoomOutPasso').classList.add('hidden');
    }
}

// Zoom in na imagem
function zoomIn(imgId) {
    const img = document.getElementById(imgId);
    img.classList.add('zoomed');
    
    // Mostrar botão de zoom out, esconder zoom in
    if (imgId === 'modalProdutoImg') {
        document.getElementById('zoomInProduto').classList.add('hidden');
        document.getElementById('zoomOutProduto').classList.remove('hidden');
    } else if (imgId === 'modalPassoImg') {
        document.getElementById('zoomInPasso').classList.add('hidden');
        document.getElementById('zoomOutPasso').classList.remove('hidden');
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// Zoom out na imagem
function zoomOut(imgId) {
    const img = document.getElementById(imgId);
    img.classList.remove('zoomed');
    
    // Mostrar botão de zoom in, esconder zoom out
    if (imgId === 'modalProdutoImg') {
        document.getElementById('zoomInProduto').classList.remove('hidden');
        document.getElementById('zoomOutProduto').classList.add('hidden');
    } else if (imgId === 'modalPassoImg') {
        document.getElementById('zoomInPasso').classList.remove('hidden');
        document.getElementById('zoomOutPasso').classList.add('hidden');
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// Fechar modal ao clicar fora
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        const modalId = event.target.id;
        fecharModal(modalId);
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
    
    // Passos
    const passoItems = document.querySelectorAll('.passo-item');
    passoItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            abrirModalPasso(index + 1);
        });
    });
});