#!/usr/bin/env node

/**
 * Helper script para converter classNames para CSS Modules
 *
 * Uso:
 * node convert-to-modules.js <caminho-do-arquivo>
 *
 * Exemplo:
 * node convert-to-modules.js app/components/Header/index.tsx
 */

const fs = require("fs");
const path = require("path");

const conversions = {
  // Header
  navbar: "navbar",
  "nav-container": "navContainer",
  "nav-menu": "navMenu",
  "nav-link": "navLink",
  hamburger: "hamburger",
  bar: "bar",

  // Hero
  hero: "hero",
  "hero-content": "heroContent",
  "cta-button": "ctaButton",
  "carousel-container": "carouselContainer",
  carousel: "carousel",
  "carousel-slide": "carouselSlide",
  "carousel-caption": "carouselCaption",
  "carousel-btn": "carouselBtn",
  "carousel-indicators": "carouselIndicators",
  indicator: "indicator",

  // About
  about: "about",
  "about-content": "aboutContent",
  "about-text": "aboutText",
  "about-features": "aboutFeatures",
  feature: "feature",

  // Events
  events: "events",
  "event-filters": "eventFilters",
  "filter-btn": "filterBtn",
  "events-grid": "eventsGrid",
  "event-card": "eventCard",
  "event-image": "eventImage",
  "event-content": "eventContent",
  "event-date": "eventDate",
  "event-title": "eventTitle",
  "event-description": "eventDescription",
  "event-status": "eventStatus",
  "status-past": "statusPast",
  "status-open": "statusOpen",
  "status-upcoming": "statusUpcoming",
  "event-btn": "eventBtn",

  // Contact
  contact: "contact",
  "contact-content": "contactContent",
  "contact-info": "contactInfo",
  "contact-methods": "contactMethods",
  "contact-btn": "contactBtn",
  "contact-form": "contactForm",
  "form-group": "formGroup",
  "submit-btn": "submitBtn",

  // Footer
  footer: "footer",
  "footer-content": "footerContent",
  "footer-about": "footerAbout",
  "footer-links": "footerLinks",
  "footer-social": "footerSocial",
  "social-icons": "socialIcons",
  "social-icon": "socialIcon",
  "footer-bottom": "footerBottom",

  // Aluno
  "aluno-login-page": "alunoLoginPage",
  "aluno-login-container": "alunoLoginContainer",
  "aluno-login-header": "alunoLoginHeader",
  "aluno-login-form": "alunoLoginForm",
  "aluno-login-button": "alunoLoginButton",
  "aluno-login-back": "alunoLoginBack",
  "aluno-container": "alunoContainer",
  "aluno-header": "alunoHeader",
  "aluno-welcome": "alunoWelcome",
  "logout-button": "logoutButton",
  "aluno-grid": "alunoGrid",
  "aluno-sidebar": "alunoSidebar",
  "profile-card": "profileCard",
  "profile-image-container": "profileImageContainer",
  "profile-image": "profileImage",
  "profile-name": "profileName",
  "profile-class": "profileClass",
  "profile-details": "profileDetails",
  "profile-detail-item": "profileDetailItem",
  "schedule-card": "scheduleCard",
  "class-schedule": "classSchedule",
  "class-day": "classDay",
  "class-time": "classTime",
  "aluno-main-content": "alunoMainContent",
  "payment-section": "paymentSection",
  "current-payment": "currentPayment",
  "current-payment-header": "currentPaymentHeader",
  "payment-month": "paymentMonth",
  "payment-status": "paymentStatus",
  "payment-amount": "paymentAmount",
  "payment-due-date": "paymentDueDate",
  "payment-buttons": "paymentButtons",
  "payment-button": "paymentButton",
  "payment-history": "paymentHistory",
  "payment-history-item": "paymentHistoryItem",
  "payment-history-month": "paymentHistoryMonth",
  "payment-history-amount": "paymentHistoryAmount",
  "payment-history-date": "paymentHistoryDate",
  "quick-stats": "quickStats",
  "stats-grid": "statsGrid",
  "stat-item": "statItem",
  "stat-value": "statValue",
  "stat-label": "statLabel",
};

function convertFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  const componentName = path.basename(path.dirname(filePath));
  const moduleName = componentName + ".module.css";

  // Adicionar import se não existir
  if (!content.includes("import styles from")) {
    const importStatement = `import styles from './${moduleName}';\n`;
    content = content.replace(
      /(import.*from.*;\n)+/,
      (match) => match + "\n" + importStatement
    );
  }

  // Converter className="xxx" para className={styles.xxx}
  for (const [oldClass, newClass] of Object.entries(conversions)) {
    // Simples: className="xxx"
    const regex1 = new RegExp(`className=["']${oldClass}["']`, "g");
    content = content.replace(regex1, `className={styles.${newClass}}`);

    // Com outras classes: className="xxx yyy"
    const regex2 = new RegExp(
      `className=["']([^"']*\\s)?${oldClass}(\\s[^"']*)?["']`,
      "g"
    );
    content = content.replace(regex2, (match, before = "", after = "") => {
      const classes = match
        .match(/className=["']([^"']*)["']/)[1]
        .split(" ")
        .filter(Boolean);
      const converted = classes.map((c) =>
        conversions[c] ? `styles.${conversions[c]}` : c
      );
      return `className={\`${converted.join(" ")}\`}`;
    });
  }

  // Salvar backup
  const backupPath = filePath + ".backup";
  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, fs.readFileSync(filePath));
    console.log(`📦 Backup criado: ${backupPath}`);
  }

  // Salvar arquivo convertido
  fs.writeFileSync(filePath, content);
  console.log(`✅ Arquivo convertido: ${filePath}`);
  console.log(`📝 Lembre-se de revisar o arquivo manualmente!`);
}

// Executar
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Uso: node convert-to-modules.js <caminho-do-arquivo>");
  console.log(
    "Exemplo: node convert-to-modules.js app/components/Header/index.tsx"
  );
} else {
  convertFile(args[0]);
}
