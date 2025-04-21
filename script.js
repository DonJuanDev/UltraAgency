// Elementos globais
const header = document.querySelector('.header');
const navLinks = document.querySelector('.nav-links');
const hero = document.querySelector('.hero');
const backToTopButton = document.querySelector('#back-to-top');
const particlesContainer = document.querySelector('#particles-network');

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Configuração do Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in', 'animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Elementos para animar
document.querySelectorAll('.service-card, .team-member, .portfolio-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Função para executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar classe fade-in via CSS
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .header.scrolled {
            background: rgba(10, 10, 10, 0.95);
            box-shadow: 0 4px 30px rgba(138, 43, 226, 0.2);
        }
        
        .typing-effect::after {
            content: '|';
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Iniciar efeito de digitação no título
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        startTypingEffect(heroTitle);
    }
    
    // Iniciar animação de partículas
    if (particlesContainer) {
        createParticlesNetwork();
    }
});

// Função para criar rede de partículas
function createParticlesNetwork() {
    const numParticles = window.innerWidth < 768 ? 30 : 80;
    const particles = [];
    
    // Criar partículas
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Propriedades da partícula
        const size = Math.random() * 5 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + '%';
        particle.style.top = y + '%';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        
        // Adicionar ao array e ao DOM
        particles.push({
            element: particle,
            x,
            y,
            size,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3
        });
        
        particlesContainer.appendChild(particle);
    }
    
    // Animar partículas
    function animateParticles() {
        const containerWidth = particlesContainer.offsetWidth;
        const containerHeight = particlesContainer.offsetHeight;
        
        particles.forEach(particle => {
            // Atualizar posição
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Verificar limites
            if (particle.x < 0 || particle.x > 100) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > 100) particle.speedY *= -1;
            
            // Atualizar posição no DOM
            particle.element.style.left = particle.x + '%';
            particle.element.style.top = particle.y + '%';
        });
        
        // Desenhar conexões entre partículas próximas
        const canvas = document.createElement('canvas');
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, containerWidth, containerHeight);
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.15)';
        
        // Desenhar linhas entre partículas
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                
                const dx = (p1.x / 100) * containerWidth - (p2.x / 100) * containerWidth;
                const dy = (p1.y / 100) * containerHeight - (p2.y / 100) * containerHeight;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo((p1.x / 100) * containerWidth, (p1.y / 100) * containerHeight);
                    ctx.lineTo((p2.x / 100) * containerWidth, (p2.y / 100) * containerHeight);
                    ctx.globalAlpha = 1 - distance / 150;
                    ctx.stroke();
                }
            }
        }
        
        // Substituir canvas antigo por novo
        const oldCanvas = particlesContainer.querySelector('canvas');
        if (oldCanvas) oldCanvas.remove();
        particlesContainer.appendChild(canvas);
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Função para efeito de digitação
function startTypingEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    element.classList.add('typing-effect');
    
    let i = 0;
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            element.classList.remove('typing-effect');
        }
    }, 50);
}

// Menu mobile
const menuButton = document.createElement('button');
menuButton.classList.add('menu-button');
menuButton.innerHTML = '<i class="fas fa-bars"></i>';
header.querySelector('.nav-container').insertBefore(menuButton, navLinks);

// Estilizar botão de menu
const menuButtonStyle = document.createElement('style');
menuButtonStyle.textContent = `
    .menu-button {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-color);
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .menu-button {
            display: block;
        }
        
        .nav-links {
            display: none;
            width: 100%;
        }
        
        .nav-links.active {
            display: flex;
        }
    }
`;
document.head.appendChild(menuButtonStyle);

// Toggle menu mobile
menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuButton.classList.toggle('active');
});

// Fechar menu ao clicar em um link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuButton.classList.remove('active');
    });
});

// Formulário de contato com validação básica
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validação básica do formulário
        const nameField = contactForm.querySelector('input[type="text"]');
        const emailField = contactForm.querySelector('input[type="email"]');
        const messageField = contactForm.querySelector('textarea');
        
        let isValid = true;
        
        // Validar campos
        if (!nameField.value.trim()) {
            showError(nameField, 'Por favor, insira seu nome');
            isValid = false;
        } else {
            clearError(nameField);
        }
        
        if (!emailField.value.trim()) {
            showError(emailField, 'Por favor, insira seu email');
            isValid = false;
        } else if (!isValidEmail(emailField.value)) {
            showError(emailField, 'Por favor, insira um email válido');
            isValid = false;
        } else {
            clearError(emailField);
        }
        
        if (!messageField.value.trim()) {
            showError(messageField, 'Por favor, insira sua mensagem');
            isValid = false;
        } else {
            clearError(messageField);
        }
        
        // Se todos os campos estiverem válidos
        if (isValid) {
            // Aqui você pode adicionar a lógica para enviar o formulário
            // Por exemplo, usando fetch para enviar para um backend
            
            // Feedback visual
            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Mensagem Enviada!';
            submitButton.style.backgroundColor = '#10B981';
            
            // Reset do formulário
            contactForm.reset();
            
            // Restaurar botão após 3 segundos
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.backgroundColor = '';
            }, 3000);
        }
    });
}

// Funções de validação
function showError(field, message) {
    // Remover erro existente
    clearError(field);
    
    // Criar e exibir mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.style.color = '#FF5252';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    field.style.borderColor = '#FF5252';
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function clearError(field) {
    field.style.borderColor = '';
    const error = field.nextElementSibling;
    if (error && error.classList.contains('error-message')) {
        error.remove();
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Adicionar classe active ao link da navegação atual e classe scrolled ao header
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

// Otimização: usando throttle para o evento de scroll para melhorar a performance
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    }
}

// Função para tratar o evento de scroll
const handleScroll = throttle(() => {
    // Atualizar classe scrolled no header
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Mostrar/esconder botão de voltar ao topo
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
    
    // Atualizar navegação ativa
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
    
    // Efeito parallax avançado
    if (hero) {
        const scrollPos = window.scrollY;
        const scrollRate = scrollPos * 0.3;
        
        // Aplicando o efeito parallax ao elemento de fundo
        const heroBackground = hero.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrollRate}px)`;
        }
    }
}, 20);

// Adicionando um único event listener para scroll
window.addEventListener('scroll', handleScroll); 