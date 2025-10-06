// --- Language manager (FR/EN) ---
// Rules handled:
// 1) Toggle blocks that are language-specific: elements having ONLY data-fr or ONLY data-en
// 2) Swap textContent for elements that have BOTH attributes data-fr and data-en (ex: nav links, inline titles)
// 3) Default language = EN (as requested), persisted in localStorage

(function () {
  const SELECTOR_FR_BLOCKS = '[data-fr]:not([data-en])';
  const SELECTOR_EN_BLOCKS = '[data-en]:not([data-fr])';
  const SELECTOR_BOTH = '[data-fr][data-en]';

  const langSelect = document.getElementById('lang');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  function applyLang(lang) {
    const isEn = lang === 'en';

    // 1) Toggle dedicated blocks
    document.querySelectorAll(SELECTOR_FR_BLOCKS).forEach(el => {
      el.style.display = isEn ? 'none' : '';
    });
    document.querySelectorAll(SELECTOR_EN_BLOCKS).forEach(el => {
      el.style.display = isEn ? '' : 'none';
    });

    // 2) Swap inline text for elements carrying both translations
    document.querySelectorAll(SELECTOR_BOTH).forEach(el => {
      const txt = el.getAttribute(isEn ? 'data-en' : 'data-fr');
      if (txt != null) el.textContent = txt;
    });

    // 3) Update html lang + persist
    document.documentElement.setAttribute('lang', isEn ? 'en' : 'fr');
    localStorage.setItem('lang', isEn ? 'en' : 'fr');

    // 4) Reflect in selector if present
    if (langSelect) langSelect.value = isEn ? 'en' : 'fr';
  }

  function detectInitialLang() {
    const stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'fr') return stored;
    // Default to EN as requested
    return 'en';
  }

  if (langSelect) {
    langSelect.addEventListener('change', e => applyLang(e.target.value));
  }

  applyLang(detectInitialLang());
})();
