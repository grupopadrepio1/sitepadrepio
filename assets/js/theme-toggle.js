// theme-toggle.js
// Aplica tema inicial (ler localStorage ou prefers-color-scheme)
(function(){
  function getStoredTheme(){
    try { return localStorage.getItem('theme'); } catch(e){ return null; }
  }

  function storeTheme(t){
    try { localStorage.setItem('theme', t); } catch(e){}
  }

  function systemPrefersDark(){
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(theme){
    if(theme === 'dark'){
      document.documentElement.setAttribute('data-theme','dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    updateIcon(theme);
  }

  function updateIcon(theme){
    const ico = document.getElementById('theme-icon');
    if(!ico) return;
    // set inner svg path for moon or sun
    if(theme === 'dark'){
      ico.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
      ico.classList.remove('text-slate-700');
    } else {
      ico.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36-6.36-.7.7M6.34 17.66l-.7.7m12.02 0l-.7-.7M6.34 6.34l-.7-.7M12 5a7 7 0 100 14 7 7 0 000-14z"/>';
      ico.classList.add('text-slate-700');
    }
  }

  // initial apply (before DOMContentLoaded ideally this file will be loaded late, but index.html also has an inline setter)
  const stored = getStoredTheme();
  const initial = stored || (systemPrefersDark() ? 'dark' : 'light');
  applyTheme(initial === 'dark' ? 'dark' : 'light');

  // Attach to toggle button when it appears (header may be injetado dinamically)
  function attachToggle(btn){
    if(!btn || btn._themeBound) return;
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      storeTheme(next);
    });
    btn._themeBound = true;
  }

  // convenience: attach to any toggle-like element (header or mobile)
  function attachAllToggles(){
    const btn1 = document.getElementById('theme-toggle');
    const btn2 = document.getElementById('theme-toggle-mobile');
    if(btn1) attachToggle(btn1);
    if(btn2) attachToggle(btn2);
  }

  // observe additions to DOM to attach toggle when header is injected
  const obs = new MutationObserver((muts)=>{
    for(const m of muts){
      for(const n of m.addedNodes){
        if(n.nodeType !== 1) continue;
        const btn = n.querySelector && n.querySelector('#theme-toggle');
        if(btn){ attachToggle(btn); return; }
      }
    }
    // fallback: try to find globally (header or mobile)
    attachAllToggles();
  });

  obs.observe(document.documentElement, { childList: true, subtree: true });

  // also try attaching after DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    attachAllToggles();
  });

})();
