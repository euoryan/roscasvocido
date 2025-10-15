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
const totalSlides = 4;
const carousel = document.getElementById('passosCarousel');
let isDown = false;
let startX;
let scrollLeft;
let isNavigating = false; // Flag para evitar conflitos

function updateCarouselDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    const slides = document.querySelectorAll('.passo-item');
    
    if (!carousel || slides.length === 0) return;
    
    // Se estamos navegando programaticamente, não atualizar o índice
    if (isNavigating) return;
    
    // Calcular qual slide está mais visível
    const scrollPosition = carousel.scrollLeft;
    const containerWidth = carousel.offsetWidth;
    const slideWidth = slides[0].offsetWidth + parseFloat(getComputedStyle(carousel).gap);
    
    // Encontrar o slide que está mais centralizado na tela
    let bestIndex = 0;
    let minDistance = Infinity;
    
    slides.forEach((slide, index) => {
        const slideLeft = index * slideWidth;
        const slideCenter = slideLeft + (slideWidth / 2);
        const containerCenter = scrollPosition + (containerWidth / 2);
        const distance = Math.abs(slideCenter - containerCenter);
        
        if (distance < minDistance) {
            minDistance = distance;
            bestIndex = index;
        }
    });
    
    // Atualizar índice atual
    currentSlideIndex = bestIndex;
    
    // Atualizar dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
    });
}

function updateDots(activeIndex) {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
    });
}

function scrollPassos(direction) {
    if (!carousel) return;
    
    const slides = document.querySelectorAll('.passo-item');
    if (slides.length === 0) return;
    
    // Ativar flag de navegação
    isNavigating = true;
    
    // Calcular próximo índice com loop infinito
    if (direction === 1) {
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    } else {
        currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    }
    
    goToSlide(currentSlideIndex);
    
    // Desativar flag após um tempo
    setTimeout(() => {
        isNavigating = false;
    }, 500);
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

function goToSlide(index) {
    if (!carousel) return;
    
    const slides = document.querySelectorAll('.passo-item');
    if (slides.length === 0) return;
    
    // Ativar flag de navegação
    isNavigating = true;
    
    // Atualizar índice atual
    currentSlideIndex = index;
    
    const slideWidth = slides[0].offsetWidth + parseFloat(getComputedStyle(carousel).gap);
    carousel.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
    });
    
    // Atualizar dots
    updateDots(index);
    
    // Desativar flag após um tempo
    setTimeout(() => {
        isNavigating = false;
    }, 500);
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// Inicializar carrossel quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    if (carousel) {
        // Event listeners para arrastar com mouse
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

        // Atualizar dots ao scrollar com debounce
        let scrollTimeout;
        carousel.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateCarouselDots();
            }, 100);
        });

        // Suporte para touch (mobile) melhorado - compatível com iPhone
        let startTouchX = 0;
        let startScrollLeft = 0;
        let isTouching = false;
        let touchStartTime = 0;

        carousel.addEventListener('touchstart', (e) => {
            startTouchX = e.touches[0].clientX;
            startScrollLeft = carousel.scrollLeft;
            isTouching = true;
            touchStartTime = Date.now();
            
            // Não prevenir default imediatamente para permitir scroll nativo
            if (e.touches.length === 1) {
                e.preventDefault();
            }
        }, { passive: false });

        carousel.addEventListener('touchmove', (e) => {
            if (!isTouching) return;
            
            // Prevenir scroll da página apenas se estiver arrastando horizontalmente
            const currentTouchX = e.touches[0].clientX;
            const diffX = Math.abs(currentTouchX - startTouchX);
            const diffY = Math.abs(e.touches[0].clientY - (e.touches[0].clientY || 0));
            
            if (diffX > diffY) {
                e.preventDefault();
                const diff = startTouchX - currentTouchX;
                carousel.scrollLeft = startScrollLeft + diff;
            }
        }, { passive: false });

        carousel.addEventListener('touchend', (e) => {
            if (!isTouching) return;
            isTouching = false;
            
            const touchDuration = Date.now() - touchStartTime;
            const currentTouchX = e.changedTouches[0].clientX;
            const diff = startTouchX - currentTouchX;
            const velocity = Math.abs(diff) / touchDuration;
            
            // Snapping para o slide mais próximo
            const slideWidth = carousel.querySelector('.passo-item').offsetWidth + parseFloat(getComputedStyle(carousel).gap);
            const currentScroll = carousel.scrollLeft;
            let targetIndex = Math.round(currentScroll / slideWidth);
            
            // Se a velocidade for alta, ir para o próximo slide
            if (velocity > 0.5) {
                if (diff > 0) {
                    targetIndex = Math.min(targetIndex + 1, totalSlides - 1);
                } else {
                    targetIndex = Math.max(targetIndex - 1, 0);
                }
            }
            
            // Aplicar loop infinito
            targetIndex = targetIndex % totalSlides;
            if (targetIndex < 0) targetIndex = totalSlides - 1;
            
            carousel.scrollTo({
                left: targetIndex * slideWidth,
                behavior: 'smooth'
            });
        });

        // Event listeners para botões de navegação
        const btnAnterior = document.querySelector('.carousel-nav-prev');
        const btnProximo = document.querySelector('.carousel-nav-next');
        
        if (btnAnterior) {
            btnAnterior.addEventListener('click', () => scrollPassos(-1));
        }
        
        if (btnProximo) {
            btnProximo.addEventListener('click', () => scrollPassos(1));
        }

        // Event listeners para dots
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        // Inicializar
        updateCarouselDots();
    }
});

// Copy PIX function - Feedback visual aprimorado
function copiarPix() {
    const chavePix = '+55 48 8803-0687';
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
    atualizarPasso();
    
    const modal = document.getElementById('modalPasso');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    
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
    if (!passo) return;
    
    document.getElementById('modalPassoTitulo').textContent = passo.titulo;
    document.getElementById('modalPassoDesc').textContent = passo.descricao;
    document.getElementById('modalPassoImg').src = passo.imagem;
    document.getElementById('modalPassoImg').alt = passo.titulo;
    document.getElementById('passoAtual').textContent = passo.numero;
    document.getElementById('passoTotal').textContent = passosData.length;
    
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
    
    // Restaurar scroll para a posição salva
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    
    // Restaurar para a posição exata onde estava
    window.scrollTo(0, scrollPosition);
    
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
                abrirModalPasso(index + 1);
            }
        });
        
        // Mouse click para desktop
        item.addEventListener('click', function(e) {
            // Verificar se não é touch device
            if (!('ontouchstart' in window)) {
                abrirModalPasso(index + 1);
            }
        });
    });


});