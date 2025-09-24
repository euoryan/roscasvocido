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
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
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
    
    // Product card interactions
    const produtoCards = document.querySelectorAll('.produto-card');
    produtoCards.forEach(card => {
        card.addEventListener('click', function() {
            const produtoNome = this.querySelector('h3').textContent;
            const produtoPreco = this.querySelector('.preco').textContent;
            
            // Haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            mostrarNotificacao(`Produto: ${produtoNome}\nPreço: ${produtoPreco}\n\nEntre em contato via WhatsApp para fazer seu pedido!`);
        });
    });
    
    // Video card interactions
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoTitulo = this.querySelector('h3').textContent;
            mostrarNotificacao(`Vídeo: ${videoTitulo}\n\nEm breve disponível!`);
        });
    });
    
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
    const animateElements = document.querySelectorAll('.produto-card, .video-card, .contato-item');
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
    
    // Generate QR Code pattern
    gerarQRCode();
});

// WhatsApp order function
function pedirWhatsApp(produto, preco) {
    const numero = '5511999999999';
    const mensagem = `Olá! Gostaria de fazer um pedido de ${produto} (${preco}).`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    
    // Haptic feedback on mobile
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
    
    window.open(url, '_blank');
}

// Copy PIX function
function copiarPix() {
    const chavePix = '+55 48 8803-0687';
    const button = document.querySelector('.btn-copy');
    const originalText = button.textContent;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(chavePix).then(() => {
            button.textContent = 'PIX copiado!';
            button.style.background = '#4CAF50';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }).catch(() => {
            fallbackCopyTextToClipboard(chavePix);
            button.textContent = 'PIX copiado!';
            button.style.background = '#4CAF50';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        });
    } else {
        fallbackCopyTextToClipboard(chavePix);
        button.textContent = 'PIX copiado!';
        button.style.background = '#4CAF50';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
}

// Fallback copy function
function fallbackCopyTextToClipboard(text) {
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
        mostrarNotificacao('Chave PIX copiada com sucesso!');
    } catch (err) {
        mostrarNotificacao('Erro ao copiar. Tente novamente.');
    }
    
    document.body.removeChild(textArea);
}

// Notification system
function mostrarNotificacao(mensagem) {
    // Remove existing notification
    const notificacaoExistente = document.querySelector('.notificacao');
    if (notificacaoExistente) {
        notificacaoExistente.remove();
    }
    
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao';
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        left: 20px;
        background: var(--primary-color);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 0.9rem;
        line-height: 1.4;
        white-space: pre-line;
        max-width: 400px;
        margin: 0 auto;
    `;
    notificacao.textContent = mensagem;
    
    document.body.appendChild(notificacao);
    
    // Animate in
    setTimeout(() => {
        notificacao.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notificacao.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.parentNode.removeChild(notificacao);
            }
        }, 300);
    }, 4000);
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