// assets/js/catequese.js
document.addEventListener('DOMContentLoaded', () => {
  function openEncontroModal(data) {
    const modal = document.getElementById('encontro-modal');
    if (!modal) return;

    document.getElementById('encontro-photo').src = data.photo || '';
    document.getElementById('encontro-photo').alt = data.title || 'Foto do encontro';
    document.getElementById('encontro-title').textContent = data.title || '';
    document.getElementById('encontro-date').textContent = data.date || '';
    document.getElementById('encontro-desc').textContent = data.desc || '';
    document.getElementById('encontro-ministrante').textContent = data.ministrante || '';

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // move focus for accessibility
    modal.querySelector('[data-focusable]')?.focus();
  }

  function closeEncontroModal() {
    const modal = document.getElementById('encontro-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // Attach handlers to any foto/title inside the catequese content
  function attachHandlers() {
    const container = document.getElementById('catequese-content');
    if (!container) return;

    container.querySelectorAll('article').forEach(article => {
      const img = article.querySelector('img.ministrante-foto');
      const titleEl = article.querySelector('h4');

      function buildData() {
        const dateEl = article.querySelector('span.text-xs');
        const descEl = article.querySelector('div.text-center p.text-sm') || article.querySelector('.text-sm.text-slate-600');
        const ministranteEl = article.querySelector('.text-sm.font-semibold.text-slate-900') || article.querySelector('p.font-semibold');
        return {
          photo: img?.getAttribute('src') || '',
          title: titleEl?.textContent?.trim() || '',
          date: dateEl?.textContent?.trim() || '',
          desc: descEl?.textContent?.trim() || '',
          ministrante: ministranteEl?.textContent?.trim() || ''
        };
      }

      if (img) {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openEncontroModal(buildData()));
      }

      if (titleEl) {
        titleEl.style.cursor = 'pointer';
        titleEl.addEventListener('click', () => openEncontroModal(buildData()));
      }
    });
  }

  // Close modal by close button or clicking outside
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('encontro-modal');
    if (!modal || modal.classList.contains('hidden')) return;
    const content = modal.querySelector('.encontro-card');
    if (!content) return;
    if (e.target === modal) closeEncontroModal();
  });

  document.getElementById('encontro-close')?.addEventListener('click', closeEncontroModal);

  // Re-attach handlers when pages are injected (SPA), observe mutations on catequese-content
  const cateContainer = document.getElementById('catequese-content');
  if (cateContainer) {
    // Wait a tick for content to be injected then attach
    setTimeout(attachHandlers, 50);

    const mo = new MutationObserver(() => {
      setTimeout(attachHandlers, 50);
    });
    mo.observe(cateContainer, { childList: true, subtree: true });
  }
});
