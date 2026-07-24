// --- Language manager (FR/EN) ---
// Rules handled:
// 1) Toggle language-specific blocks: elements having ONLY data-fr or ONLY data-en
// 2) Swap textContent for elements having BOTH data-fr and data-en
// 3) Translate the browser-tab title from data-title-fr / data-title-en on <body>
// 4) Default language = EN, persisted in localStorage

(function () {
  'use strict';

  const SELECTOR_FR_BLOCKS = '[data-fr]:not([data-en])';
  const SELECTOR_EN_BLOCKS = '[data-en]:not([data-fr])';
  const SELECTOR_BOTH = '[data-fr][data-en]';

  const langSelect = document.getElementById('lang');
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  function applyLang(lang) {
    const normalizedLang = lang === 'fr' ? 'fr' : 'en';
    const isEn = normalizedLang === 'en';

    // 1) Afficher ou masquer les blocs propres à chaque langue.
    document.querySelectorAll(SELECTOR_FR_BLOCKS).forEach((el) => {
      el.style.display = isEn ? 'none' : '';
    });

    document.querySelectorAll(SELECTOR_EN_BLOCKS).forEach((el) => {
      el.style.display = isEn ? '' : 'none';
    });

    // 2) Remplacer les textes des éléments possédant les deux traductions.
    document.querySelectorAll(SELECTOR_BOTH).forEach((el) => {
      const text = el.getAttribute(
        isEn ? 'data-en' : 'data-fr'
      );

      if (text !== null) {
        el.textContent = text;
      }
    });

    // 3) Traduire le titre de l’onglet du navigateur.
    const body = document.body;

    if (body) {
      const title = body.getAttribute(
        isEn ? 'data-title-en' : 'data-title-fr'
      );

      if (title) {
        document.title = title;
      }
    }

    // 4) Mettre à jour la langue du document et mémoriser le choix.
    document.documentElement.setAttribute(
      'lang',
      normalizedLang
    );

    localStorage.setItem(
      'lang',
      normalizedLang
    );

    // 5) Synchroniser le sélecteur de langue.
    if (langSelect) {
      langSelect.value = normalizedLang;

      langSelect.setAttribute(
        'aria-label',
        isEn
          ? 'Select language'
          : 'Choisir la langue'
      );
    }
  }

  function detectInitialLang() {
    const stored = localStorage.getItem('lang');

    if (stored === 'en' || stored === 'fr') {
      return stored;
    }

    // Langue par défaut du site.
    return 'en';
  }

  if (langSelect) {
    langSelect.addEventListener(
      'change',
      (event) => {
        applyLang(event.target.value);
      }
    );
  }

  applyLang(
    detectInitialLang()
  );
})();
