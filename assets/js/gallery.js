
// assets/js/gallery.js

let albumsData = [];
let currentAlbum = null;
let currentPhotoIndex = 0;

async function initGallery() {
  try {
    const response = await fetch('albums.json');
    albumsData = await response.json();
    renderAlbums();
  } catch (err) {
    console.error('Erro ao carregar albums.json:', err);
  }
}

function renderAlbums() {
  const container = document.getElementById('albums-container');
  if (!container) return;

  container.innerHTML = '';

  const grid = document.createElement('div');
  // usa classes utilitárias do Tailwind quando disponíveis e adiciona nossa classe de grid responsivo
  grid.className = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 albums-grid';

  albumsData.forEach((album, index) => {
    const card = document.createElement('button');
    card.className = 'album-card bg-white rounded-lg shadow hover:shadow-lg overflow-hidden text-left focus:outline-none';
    card.setAttribute('aria-label', `Abrir álbum ${album.name}`);

    card.innerHTML = `
      <div class="cover">
        <img src="assets/img/${album.folder}/${album.cover}" alt="${album.name}" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-90"></div>
        <div class="absolute bottom-3 left-3 text-white">
          <h3 class="font-semibold text-lg">${album.name}</h3>
          <p class="text-sm opacity-90">${album.photos.length} fotos</p>
        </div>
      </div>
      <div class="p-4 space-y-1">
        <p class="text-sm text-gray-600">${album.description}</p>
      </div>
    `;

    card.addEventListener('click', () => openAlbum(index));
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

function openAlbum(index) {
  currentAlbum = albumsData[index];
  currentPhotoIndex = 0;

  document.getElementById('album-title').textContent = currentAlbum.name;
  document.getElementById('album-description').textContent = currentAlbum.description || '';
  document.getElementById('album-caption').textContent = `${currentAlbum.photos.length} foto(s)`;

  renderMainPhoto();
  renderThumbnails();

  document.getElementById('album-modal').classList.remove('hidden');

  // set focus for accessibility
  setTimeout(() => document.getElementById('main-photo')?.focus?.(), 50);
}

function closeAlbum() {
  document.getElementById('album-modal').classList.add('hidden');
}

function renderMainPhoto() {
  const mainPhoto = document.getElementById('main-photo');
  const src = `assets/img/${currentAlbum.folder}/${currentAlbum.photos[currentPhotoIndex]}`;
  mainPhoto.src = src;
  mainPhoto.alt = currentAlbum.name + ' — foto ' + (currentPhotoIndex + 1);

  // preload adjacent images
  const nextIdx = (currentPhotoIndex + 1) % currentAlbum.photos.length;
  const prevIdx = (currentPhotoIndex - 1 + currentAlbum.photos.length) % currentAlbum.photos.length;
  [nextIdx, prevIdx].forEach(i => {
    const img = new Image();
    img.src = `assets/img/${currentAlbum.folder}/${currentAlbum.photos[i]}`;
  });
}

function renderThumbnails() {
  const thumbs = document.getElementById('thumbs');
  thumbs.innerHTML = '';

  currentAlbum.photos.forEach((photo, index) => {
    const img = document.createElement('img');
    img.src = `assets/img/${currentAlbum.folder}/${photo}`;
    img.loading = 'lazy';
    img.className = 'thumb w-20 h-20 object-cover rounded cursor-pointer';

    img.alt = `${currentAlbum.name} — foto ${index + 1}`;

    if (index === currentPhotoIndex) {
      img.classList.add('ring-2');
    }

    img.addEventListener('click', () => {
      currentPhotoIndex = index;
      renderMainPhoto();
      renderThumbnails();
    });

    thumbs.appendChild(img);
  });
}

// Keyboard navigation and interactions
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('album-modal');
  if (!modal || modal.classList.contains('hidden')) return;

  if (e.key === 'Escape') closeAlbum();
  if (e.key === 'ArrowRight') nextPhoto();
  if (e.key === 'ArrowLeft') prevPhoto();
});

function nextPhoto() {
  if (!currentAlbum) return;
  currentPhotoIndex = (currentPhotoIndex + 1) % currentAlbum.photos.length;
  renderMainPhoto();
  renderThumbnails();
}

function prevPhoto() {
  if (!currentAlbum) return;
  currentPhotoIndex = (currentPhotoIndex - 1 + currentAlbum.photos.length) % currentAlbum.photos.length;
  renderMainPhoto();
  renderThumbnails();
}

// Modal controls
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('close-modal')?.addEventListener('click', closeAlbum);
  document.getElementById('next-photo')?.addEventListener('click', nextPhoto);
  document.getElementById('prev-photo')?.addEventListener('click', prevPhoto);

  // clicking on backdrop closes
  document.getElementById('album-modal')?.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'album-modal') closeAlbum();
  });

  // fullscreen toggle
  document.getElementById('fullscreen-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('album-modal');
    if (!modal) return;
    if (!document.fullscreenElement) modal.requestFullscreen?.(); else document.exitFullscreen?.();
  });

  // Função que conecta os handlers do modal (safe to call multiple times)
  function attachModalControls() {
    const closeBtn = document.getElementById('close-modal');
    const nextBtn = document.getElementById('next-photo');
    const prevBtn = document.getElementById('prev-photo');
    const modal = document.getElementById('album-modal');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const mainPhotoEl = document.getElementById('main-photo');

    if (closeBtn && !closeBtn._bound) {
      closeBtn.addEventListener('click', closeAlbum);
      closeBtn._bound = true;
    }

    if (nextBtn && !nextBtn._bound) {
      nextBtn.addEventListener('click', nextPhoto);
      nextBtn._bound = true;
    }

    if (prevBtn && !prevBtn._bound) {
      prevBtn.addEventListener('click', prevPhoto);
      prevBtn._bound = true;
    }

    // clicking on backdrop closes
    if (modal && !modal._backdropBound) {
      modal.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'album-modal') closeAlbum();
      });
      modal._backdropBound = true;
    }

    // fullscreen toggle
    if (fullscreenBtn && !fullscreenBtn._bound) {
      fullscreenBtn.addEventListener('click', () => {
        const el = document.getElementById('album-modal') || document.documentElement;
        if (!el) return;
        if (!document.fullscreenElement) {
          // request fullscreen on the modal container if possible
          (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen).call(el);
        } else {
          (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen).call(document);
        }
      });
      fullscreenBtn._bound = true;
    }

    // touch gestures (swipe left/right) on main photo
    if (mainPhotoEl && !mainPhotoEl._touchBound) {
      let startX = null;
      mainPhotoEl.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
      mainPhotoEl.addEventListener('touchend', (e) => {
        if (startX === null) return;
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) nextPhoto(); else prevPhoto();
        }
        startX = null;
      }, { passive: true });
      mainPhotoEl._touchBound = true;
    }
  }

  // Tenta conectar imediatamente (caso includes já estejam no DOM)
  attachModalControls();

  // Observador que espera a inserção do modal (quando includes são injetados via fetch)
  const bodyObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1) {
            // se o modal foi adicionado em qualquer lugar, conectar controles
            if (node.querySelector && (node.id === 'album-modal' || node.querySelector('#album-modal'))) {
              attachModalControls();
              return;
            }
          }
        }
      }
    }
  });

  bodyObserver.observe(document.body, { childList: true, subtree: true });

});

