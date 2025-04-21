// Elementos globais
const header = document.querySelector(".header");
const navLinks = document.querySelector(".nav-links");
const menuButton = document.querySelector(".menu-button");
const hero = document.querySelector(".hero");
const backToTopButton = document.querySelector("#back-to-top");
const particlesContainer = document.querySelector("#particles-network");

// Gerenciar menu mobile
if (menuButton) {
  menuButton.addEventListener("click", function () {
    this.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
}

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Configuração do Intersection Observer
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in", "animate");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Elementos para animar
document
  .querySelectorAll(
    ".service-card, .team-member, .portfolio-item, .checklist-card, .contact-box, .testimonial-item, .process-step"
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });

// Função para executar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Adicionar classe fade-in via CSS
  const style = document.createElement("style");
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

  // Inicializar filtro de portfólio
  initPortfolioFilter();

  // Iniciar efeito de digitação no título
  const heroTitle = document.querySelector(".hero h1");
  if (heroTitle) {
    startTypingEffect(heroTitle);
  }

  // Iniciar animação de partículas
  if (particlesContainer) {
    createParticlesNetwork();
  }

  // Tratar evento de scroll
  handleScroll();
});

// Filtro de Portfólio
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll(".filter-button");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  if (filterButtons.length && portfolioItems.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remover classe ativa de todos os botões
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Adicionar classe ativa ao botão clicado
        button.classList.add("active");

        // Obter categoria do filtro
        const filterValue = button.getAttribute("data-filter");

        // Filtrar itens
        portfolioItems.forEach((item) => {
          if (
            filterValue === "all" ||
            item.getAttribute("data-category") === filterValue
          ) {
            item.style.display = "block";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, 100);
          } else {
            item.style.opacity = "0";
            item.style.transform = "translateY(20px)";
            setTimeout(() => {
              item.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }
}

// Gerenciar eventos de scroll
function handleScroll() {
  window.addEventListener(
    "scroll",
    throttle(function () {
      // Header efeito ao scroll
      if (window.pageYOffset > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      // Mostrar/esconder botão de volta ao topo
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    }, 200)
  );
}

// Função para criar rede de partículas
function createParticlesNetwork() {
  const numParticles = window.innerWidth < 768 ? 30 : 80;
  const particles = [];

  // Criar partículas
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Propriedades da partícula
    const size = Math.random() * 5 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.left = x + "%";
    particle.style.top = y + "%";
    particle.style.opacity = Math.random() * 0.5 + 0.2;

    // Adicionar ao array e ao DOM
    particles.push({
      element: particle,
      x,
      y,
      size,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
    });

    particlesContainer.appendChild(particle);
  }

  // Animar partículas
  function animateParticles() {
    const containerWidth = particlesContainer.offsetWidth;
    const containerHeight = particlesContainer.offsetHeight;

    particles.forEach((particle) => {
      // Atualizar posição
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Verificar limites
      if (particle.x < 0 || particle.x > 100) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > 100) particle.speedY *= -1;

      // Atualizar posição no DOM
      particle.element.style.left = particle.x + "%";
      particle.element.style.top = particle.y + "%";
    });

    // Desenhar conexões entre partículas próximas
    const canvas = document.createElement("canvas");
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "-1";

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, containerWidth, containerHeight);
    ctx.strokeStyle = "rgba(138, 43, 226, 0.15)";

    // Desenhar linhas entre partículas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];

        const dx =
          (p1.x / 100) * containerWidth - (p2.x / 100) * containerWidth;
        const dy =
          (p1.y / 100) * containerHeight - (p2.y / 100) * containerHeight;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(
            (p1.x / 100) * containerWidth,
            (p1.y / 100) * containerHeight
          );
          ctx.lineTo(
            (p2.x / 100) * containerWidth,
            (p2.y / 100) * containerHeight
          );
          ctx.globalAlpha = 1 - distance / 150;
          ctx.stroke();
        }
      }
    }

    // Substituir canvas antigo por novo
    const oldCanvas = particlesContainer.querySelector("canvas");
    if (oldCanvas) oldCanvas.remove();
    particlesContainer.appendChild(canvas);

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

// Função para efeito de digitação
function startTypingEffect(element) {
  const text = element.textContent;
  element.textContent = "";
  element.classList.add("typing-effect");

  let i = 0;
  const typingInterval = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typingInterval);
      element.classList.remove("typing-effect");
    }
  }, 50);
}

// Função Throttle para otimizar eventos de scroll
function throttle(func, delay) {
  let timeout = null;
  return function () {
    const context = this;
    const args = arguments;
    if (!timeout) {
      timeout = setTimeout(function () {
        func.apply(context, args);
        timeout = null;
      }, delay);
    }
  };
}

// Otimizações de SEO
document.addEventListener("DOMContentLoaded", function () {
  // Adicionar estrutura de dados schema.org para SEO
  const schemaScript = document.createElement("script");
  schemaScript.type = "application/ld+json";
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ultra Agency",
    url: "https://ultraagency.com",
    logo: "https://ultraagency.com/assets/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55 48 9999-9999",
      contactType: "customer service",
    },
    sameAs: [
      "https://www.instagram.com/ultraagency",
      "https://www.linkedin.com/company/ultraagency",
    ],
  };
  schemaScript.textContent = JSON.stringify(schemaData);
  document.head.appendChild(schemaScript);
});
