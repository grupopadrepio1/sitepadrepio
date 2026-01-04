// assets/js/music-player.js
// Tornar a inicialização resiliente caso o footer ainda não tenha sido injetado
function initMusicPlayer() {
  const audio = document.getElementById("audio-player");
  const playBtn = document.getElementById("play-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const shuffleBtn = document.getElementById("shuffle-btn");
  const titleEl = document.getElementById("track-title");
  const artistEl = document.getElementById("track-artist");
  const progressBar = document.getElementById("progress-bar");
  const volumeControl = document.getElementById("volume-control");

  if (!audio || !playBtn) return false;

  /* =========================
    PLAYLIST gerada a partir do conteúdo de assets/audio
    Atualizada para refletir os arquivos presentes na pasta (nomes inferidos a partir dos nomes dos arquivos)
  ========================== */
  const playlist = [
    { title: "O Poço", artist: "Adriana Arydes", src: "assets/audio/Adriana Arydes - O Poço-compactado.mp3" },
    { title: "Fernando Vinhote & Jaquelinni Moraes", artist: "Carlo Acutis", src: "assets/audio/Carlo Acutis - Fernando Vinhote & Jaquelinni Moraes-compactado.mp3" },
    { title: "Coração de Pedra", artist: "Vários", src: "assets/audio/Coração de pedra - Ministério M3 feat. André Cavalcante-compactado.mp3" },
    { title: "Subirei a Montanha", artist: "Dago Soares, Aline Brasil", src: "assets/audio/Dago Soares, Aline Brasil - Subirei a Montanha-compactado.mp3" },
    { title: "Ressuscita-Me (Ao Vivo)", artist: "Dago Soares, Alvaro & Daniel", src: "assets/audio/Dago Soares, Alvaro & Daniel - Ressuscita-Me (Ao Vivo)-compactado.mp3" },
    { title: "EU NÃO ESQUEÇO (Parte 2)", artist: "Diego Fernandes", src: "assets/audio/EU NÃO ESQUEÇO - Diego Fernandes [Parte 2] - Ano 10-compactado.mp3" },
    { title: "Era Eu", artist: "Pierre Antonio", src: "assets/audio/Era Eu - Pierre Antonio (Clipe Oficial)-compactado.mp3" },
    { title: "Amor, Força e Vitória", artist: "Fernando Vinhote & Diego Fernandes", src: "assets/audio/Fernando Vinhote & Diego Fernandes - Amor, Força e Vitória (Clipe Oficial)-compactado.mp3" },
    { title: "DNA de Maria", artist: "Fernando Vinhote", src: "assets/audio/Fernando Vinhote - DNA de Maria (Video Oficial)-compactado.mp3" },
    { title: "Me Aceita de Volta", artist: "Fernando Vinhote", src: "assets/audio/Fernando Vinhote - Me Aceita de Volta (Clipe Oficial)-compactado.mp3" },
    { title: "Pelas Mãos de Maria", artist: "Fernando Vinhote", src: "assets/audio/Fernando Vinhote - Pelas Mãos de Maria (Clipe Oficial)-compactado.mp3" },
    { title: "Valei-me São José", artist: "Fernando Vinhote", src: "assets/audio/Fernando Vinhote - Valei-me São José (Clipe Oficial)-compactado.mp3" },
    { title: "Meus Passos", artist: "João Morada", src: "assets/audio/Meus Passos - João Morada-compactado.mp3" },
    { title: "Coração de Pedra (Clipe Oficial)", artist: "Ministério M3", src: "assets/audio/Ministério M3 - Coração de Pedra (Clipe Oficial)-compactado.mp3" },
    { title: "Mãos Chagadas", artist: "Silvia Rodrigues", src: "assets/audio/Mãos Chagadas - Silvia Rodrigues-compactado.mp3" },
    { title: "PARAPAPA", artist: "Missionário Shalom", src: "assets/audio/PARAPAPA - Missionário Shalom (DVD Mais Que Tudo)-compactado.mp3" },
    { title: "Incendeia Minha Alma (Ao vivo)", artist: "Padre Diogo Albuquerque", src: "assets/audio/Padre Diogo Albuquerque - Incendeia Minha Alma (Ao vivo)-compactado.mp3" },
    { title: "Pedi E Recebereis", artist: "Padre Reginaldo Manzotti", src: "assets/audio/Padre Reginaldo Manzotti - Pedi E Recebereis-compactado.mp3" },
    { title: "QUERO MERGULHAR", artist: "Ministério M3", src: "assets/audio/QUERO MERGULHAR Ministério M3 feat André Cavalcante-compactado.mp3" },
    { title: "Cordeiro", artist: "Thiago Brado", src: "assets/audio/Thiago Brado - Cordeiro-compactado.mp3" },
    { title: "Diante Do Rei", artist: "Thiago Brado", src: "assets/audio/Thiago Brado - Diante Do Rei (Clássicos da Igreja)-compactado.mp3" },
    { title: "Hoje Livre Sou", artist: "Thiago Brado", src: "assets/audio/Thiago Brado - Hoje Livre Sou (Clássicos da Igreja)-compactado.mp3" },
    { title: "Me Fortalece", artist: "Thiago Brado", src: "assets/audio/Thiago Brado - Me Fortalece-compactado.mp3" },
    { title: "Noites Traiçoeiras", artist: "Thiago Brado", src: "assets/audio/Thiago Brado - Noites Traiçoeiras (Clássicos da Igreja)-compactado.mp3" },
    { title: "Não Vai Ser Fácil", artist: "Thiago Brado", src: "assets/audio/Thiago Brado - Não Vai Ser Fácil (Clipe Oficial)-compactado.mp3" },
    { title: "Teu Colo Mãe", artist: "Thiago Brado", src: "assets/audio/Thiago Brado - Teu Colo Mãe-compactado.mp3" },
    { title: "Um Natal De Amor", artist: "Katholika (Cantata)", src: "assets/audio/Um Natal De Amor - Cantata de Natal Katholika 2025-compactado.mp3" }
  ];

  // Começa com música aleatória
  let currentTrack = Math.floor(Math.random() * playlist.length);
  let shuffle = false;
  let isSeeking = false;

  /* =========================
     FUNÇÕES
  ========================== */
  function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    audio.load();
    titleEl.textContent = track.title;
    artistEl.textContent = track.artist;
    progressBar.value = 0;
  }

  function play() {
    audio.play();
    playBtn.textContent = "❚❚";
  }

  function pause() {
    audio.pause();
    playBtn.textContent = "▶︎";
  }

  function togglePlay() {
    audio.paused ? play() : pause();
  }

  function nextTrack() {
    currentTrack = shuffle
      ? Math.floor(Math.random() * playlist.length)
      : (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    play();
  }

  function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    play();
  }

  /* =========================
     EVENTOS
  ========================== */
  playBtn.addEventListener("click", togglePlay);
  nextBtn.addEventListener("click", nextTrack);
  prevBtn.addEventListener("click", prevTrack);
  audio.addEventListener("ended", nextTrack);

  shuffleBtn?.addEventListener("click", () => {
    shuffle = !shuffle;
    shuffleBtn.style.opacity = shuffle ? "1" : "0.4";
  });

  // Barra de progresso
  progressBar?.addEventListener("pointerdown", () => isSeeking = true);
  progressBar?.addEventListener("pointerup", () => {
    isSeeking = false;
    if (audio.duration) audio.currentTime = (progressBar.value / 100) * audio.duration;
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration || isSeeking) return;
    progressBar.value = (audio.currentTime / audio.duration) * 100;
  });

  // Volume
  volumeControl?.addEventListener("input", () => {
    audio.volume = volumeControl.value;
  });
  if (volumeControl) audio.volume = volumeControl.value;

  /* =========================
     INICIALIZAÇÃO
  ========================== */
  loadTrack(currentTrack);

  return true;
}

// Tenta inicializar imediatamente; se os elementos não existirem ainda, observa o body e inicializa quando o audio aparecer
if (!initMusicPlayer()) {
  const mo = new MutationObserver((mutations, obs) => {
    if (document.getElementById('audio-player')) {
      initMusicPlayer();
      obs.disconnect();
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });
}
