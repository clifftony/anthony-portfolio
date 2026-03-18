const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const backToTop = document.getElementById("backToTop");
const revealElements = document.querySelectorAll(".reveal");
const typewriterElement = document.getElementById("typewriter");
const statValues = document.querySelectorAll(".stat-value");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

const roles = [
  "Cybersecurity Analyst",
  "Security Operations Center (SOC) Analyst",
  "Information Security Analyst",
  "Governance, Risk, and Compliance (GRC) Analyst",
  "Threat Intelligence Analyst"
  ];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function toggleMenu() {
  navMenu.classList.toggle("open");
  const expanded = navMenu.classList.contains("open");
  navToggle.setAttribute("aria-expanded", String(expanded));
}

if (navToggle) {
  navToggle.addEventListener("click", toggleMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

function setActiveNav() {
  const scrollY = window.scrollY + 140;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => link.classList.remove("active"));
      navLink.classList.add("active");
    }
  });
}

function handleBackToTop() {
  if (window.scrollY > 500) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
}

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((element) => revealObserver.observe(element));

function typeWriterEffect() {
  const currentText = roles[roleIndex];

  if (!typewriterElement) return;

  if (isDeleting) {
    typewriterElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 45 : 85;

  if (!isDeleting && charIndex === currentText.length) {
    speed = 1400;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 350;
  }

  setTimeout(typeWriterEffect, speed);
}

function animateCounter(el) {
  const target = Number(el.dataset.target);
  let current = 0;
  const duration = 1200;
  const stepTime = 40;
  const increment = Math.max(1, Math.ceil(target / (duration / stepTime)));

  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(counter);
    }
    el.textContent = `${current}+`;
  }, stepTime);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.8 }
);

statValues.forEach((value) => statObserver.observe(value));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === "all" || filter === category;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

function showError(input, message) {
  input.classList.add("error");
  const errorText = input.parentElement.querySelector(".error-text");
  errorText.textContent = message;
}

function clearError(input) {
  input.classList.remove("error");
  const errorText = input.parentElement.querySelector(".error-text");
  errorText.textContent = "";
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    let isValid = true;
    formMessage.textContent = "";
    formMessage.className = "form-message";

    [name, email, message].forEach(clearError);

    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, "Please enter your name.");
      isValid = false;
    }

    if (!email.value.trim()) {
      showError(email, "Please enter your email address.");
      isValid = false;
    } else if (!validateEmail(email.value)) {
      showError(email, "Please enter a valid email address.");
      isValid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 10) {
      showError(message, "Please enter a message with at least 10 characters.");
      isValid = false;
    }

    if (!isValid) {
      formMessage.textContent = "Please fix the highlighted fields and try again.";
      formMessage.classList.add("error");
      return;
    }

    formMessage.textContent = "Message sent successfully. This demo form is ready to connect to a backend or email service.";
    formMessage.classList.add("success");
    contactForm.reset();
  });
}

window.addEventListener("scroll", () => {
  setActiveNav();
  handleBackToTop();
});

window.addEventListener("load", () => {
  setActiveNav();
  handleBackToTop();
  typeWriterEffect();
});