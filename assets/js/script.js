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
    document.body.style.overflow = 'hidden';
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// Controle do passo atual
let passoAtualIndex = 0;

// Abrir modal de passo
function abrirModalPasso(numero) {
    passoAtualIndex = numero - 1;
    atualizarPasso();
    
    const modal = document.getElementById('modalPasso');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
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
            mostrarConfete();
            setTimeout(() => {
                console.log('Fechando modal');
                fecharModal('modalPasso');
            }, 800);
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
    const cores = ['#3b401b', '#C17624', '#9E6132'];
    const quantidade = 20;
    
    // Criar confetes de forma mais visível
    for (let i = 0; i < quantidade; i++) {
        const confete = document.createElement('div');
        confete.className = 'confetti';
        
        // Posição inicial aleatória no topo da tela
        const posX = Math.random() * window.innerWidth;
        confete.style.left = posX + 'px';
        confete.style.top = '-20px';
        
        // Estilo do confete
        confete.style.background = cores[Math.floor(Math.random() * cores.length)];
        confete.style.width = (Math.random() * 8 + 4) + 'px'; // 4-12px
        confete.style.height = (Math.random() * 8 + 4) + 'px';
        confete.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        // Animação
        const duracao = Math.random() * 1 + 1.5; // 1.5-2.5s
        const delay = Math.random() * 0.3; // 0-0.3s
        confete.style.animation = `confetti-fall ${duracao}s ease-out ${delay}s forwards`;
        
        document.body.appendChild(confete);
        console.log('Confete criado:', i + 1);
        
        // Remover após animação completa
        setTimeout(() => {
            confete.remove();
        }, (duracao + delay) * 1000 + 100);
    }
    
    console.log(quantidade + ' confetes criados!');
    
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
    document.body.style.overflow = '';
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