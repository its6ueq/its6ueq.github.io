import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MiniApps from './pages/MiniApps';
import PomodoroTimer from './pages/PomodoroTimer';

const App: React.FC = () => {
  useEffect(() => {
    const audioPlayer = new Audio();
    const lofiBackgroundAudio = document.getElementById('lofi-background-audio') as HTMLAudioElement;

    const LOFI_MAX_VOLUME_RATIO = 0.2;
    const SPECIAL_TRACKS: string[] = [];

    const socialIcons = document.querySelectorAll('.social-links a');

    const songNameEl = document.getElementById('song-name');
    const artistNameEl = document.getElementById('artist-name');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const progressEl = document.getElementById('progress');
    const progressContainer = document.getElementById('progress-container');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = document.getElementById('play-pause-icon');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
    const volumeIconEl = document.getElementById('volume-icon');

    let isPlayConfirmed = false;

    const trackList = [{
        name: "feelslikeimfallinginlove",
        artist: "Coldplay",
        src: "/feelslikeimfallinginlove.mp3",
        cover: "/feelslikeimfallinginlove.png"
    }];

    let currentTrackIndex = 0;
    let isPlaying = false;

    function toggleLofiBackground(playLofi: boolean) {
        if (!lofiBackgroundAudio) return;
        
        if (playLofi) {
            lofiBackgroundAudio.play().catch(e => console.log("Lofi auto-play blocked."));
            if (lofiBackgroundAudio) lofiBackgroundAudio.volume = parseFloat(volumeSlider?.value || '0.5') * LOFI_MAX_VOLUME_RATIO;
        } else {
            lofiBackgroundAudio.pause();
        }
    }

    function updateVolumeIcon(volume: number) {
        let iconClass = '';
        if (volume == 0) {
            iconClass = 'fas fa-volume-off';
        } else if (volume < 0.5) {
            iconClass = 'fas fa-volume-down';
        } else {
            iconClass = 'fas fa-volume-up';
        }
        if (volumeIconEl) {
            volumeIconEl.innerHTML = `<i class="${iconClass}"></i>`;
        }
    }

    function loadTrack(trackIndex: number, autoPlay = false) {
        const track = trackList[trackIndex];
        audioPlayer.src = track.src;
        if (songNameEl) songNameEl.textContent = track.name;
        if (artistNameEl) artistNameEl.textContent = track.artist;

        const albumArtMini = document.querySelector('.album-art-mini img');
        if (albumArtMini) {
            (albumArtMini as HTMLImageElement).src = track.cover;
        } else {
            const container = document.querySelector('.album-art-mini');
            if (container) {
                container.innerHTML = `<img src="${track.cover}" alt="Album Art" class="w-full h-full object-cover rounded-md">`;
            }
        }
        audioPlayer.load();

        isPlayConfirmed = !SPECIAL_TRACKS.includes(track.name);

        if (autoPlay && isPlayConfirmed) {
            audioPlayer.play().then(() => {
                isPlaying = true;
                updatePlayPauseIcon(isPlaying);
                toggleLofiBackground(false);
            }).catch(e => {
                console.error("Lỗi khi cố gắng phát nhạc tự động.", e);
                isPlaying = false;
                updatePlayPauseIcon(false);
                toggleLofiBackground(true);
            });
        } else {
            isPlaying = false;
            updatePlayPauseIcon(false);
            toggleLofiBackground(true);
        }
    }

    function playPauseTrack() {
        const currentTrackName = trackList[currentTrackIndex].name;

        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            updatePlayPauseIcon(isPlaying);
            toggleLofiBackground(true);
        } else {
            if (SPECIAL_TRACKS.includes(currentTrackName) && !isPlayConfirmed) {
            } else {
                lofiBackgroundAudio.muted = false;

                audioPlayer.play().then(() => {
                    isPlaying = true;
                    updatePlayPauseIcon(isPlaying);
                    toggleLofiBackground(false);
                }).catch(e => {
                    console.error("Lỗi khi cố gắng phát nhạc.", e);
                    isPlaying = false;
                    updatePlayPauseIcon(false);
                    toggleLofiBackground(true);
                });
            }
        }
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
        loadTrack(currentTrackIndex, isPlaying);
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
        loadTrack(currentTrackIndex, isPlaying);
    }

    function updatePlayPauseIcon(playing: boolean) {
        if (playPauseIcon) {
            playPauseIcon.className = playing ? 'fas fa-pause' : 'fas fa-play';
        }
    }

    const formatTime = (time: number) => {
        if (!isFinite(time) || time < 0) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    audioPlayer.addEventListener('timeupdate', () => {
        const duration = audioPlayer.duration;
        const currentTime = audioPlayer.currentTime;
        if (isFinite(duration) && duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            if (progressEl) {
                progressEl.style.width = progressPercent + '%';
            }
            if (currentTimeEl) {
                currentTimeEl.textContent = formatTime(currentTime);
            }
        } else {
            if (currentTimeEl) {
                currentTimeEl.textContent = '0:00';
            }
        }
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        if (isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
            if (durationEl) {
                durationEl.textContent = formatTime(audioPlayer.duration);
            }
        }
    });

    audioPlayer.addEventListener('ended', () => {
        nextTrack();
    });

    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            const width = progressContainer.clientWidth;
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const duration = audioPlayer.duration;
            if (isFinite(duration) && duration > 0) {
                audioPlayer.currentTime = (clickX / width) * duration;
            }
        });
    }

    if (volumeSlider) {
        const volumeFill = document.getElementById('volume-fill');
        const volumeThumb = document.getElementById('volume-thumb');
        
        const updateVolumeSlider = () => {
            const value = parseFloat(volumeSlider.value);
            const percentage = value * 100;
            
            if (volumeFill) {
                volumeFill.style.width = `${percentage}%`;
            }
            if (volumeThumb) {
                volumeThumb.style.left = `calc(${percentage}% - 7px)`;
            }
        };
        
        volumeSlider.addEventListener('input', (e) => {
            const newVolume = parseFloat((e.target as HTMLInputElement).value);
            audioPlayer.volume = newVolume;
            if (lofiBackgroundAudio) lofiBackgroundAudio.volume = newVolume * LOFI_MAX_VOLUME_RATIO;
            updateVolumeIcon(audioPlayer.volume);
            updateVolumeSlider();
        });
        
        updateVolumeSlider();
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', playPauseTrack);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTrack);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', prevTrack);
    }

    loadTrack(currentTrackIndex);
    audioPlayer.volume = parseFloat(volumeSlider?.value || '0.5');
    if (lofiBackgroundAudio) lofiBackgroundAudio.volume = parseFloat(volumeSlider?.value || '0.5') * LOFI_MAX_VOLUME_RATIO;
    updateVolumeIcon(audioPlayer.volume);

    socialIcons.forEach(icon => {
        icon.classList.add('is-round');
        setTimeout(() => {
            icon.classList.remove('is-round');
        }, 1000);
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mini-apps" element={<MiniApps />} />
        <Route path="/mini-apps/pomodoro" element={<PomodoroTimer />} />
      </Routes>
    </Router>
  );
};

const HomePage: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const audioPlayer = new Audio();
      const lofiBackgroundAudio = document.getElementById('lofi-background-audio') as HTMLAudioElement;

      if (!lofiBackgroundAudio) {
        console.error('Lofi background audio element not found');
        return;
      }

      const LOFI_MAX_VOLUME_RATIO = 0.2;
      const SPECIAL_TRACKS: string[] = [];

      const socialIcons = document.querySelectorAll('.social-links a');

      const songNameEl = document.getElementById('song-name');
      const artistNameEl = document.getElementById('artist-name');
      const currentTimeEl = document.getElementById('current-time');
      const durationEl = document.getElementById('duration');
      const progressEl = document.getElementById('progress');
      const progressContainer = document.getElementById('progress-container');
      const playPauseBtn = document.getElementById('play-pause-btn');
      const playPauseIcon = document.getElementById('play-pause-icon');
      const nextBtn = document.getElementById('next-btn');
      const prevBtn = document.getElementById('prev-btn');
      const volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
      const volumeIconEl = document.getElementById('volume-icon');

      let isPlayConfirmed = false;

    const trackList = [{
        name: "Feels Like I'm Falling In Love",
        artist: "Coldplay",
        src: "/feelslikeimfallinginlove.mp3",
        cover: "/feelslikeimfallinginlove.png"
    }, {
        name: "Lofi Chill Vibes",
        artist: "Chill Music",
        src: "/feelslikeimfallinginlove.mp3",
        cover: "/its6ueq.jfif"
    }, {
        name: "Ambient Sounds",
        artist: "Nature Music",
        src: "/feelslikeimfallinginlove.mp3",
        cover: "/its6ueq.jfif"
    }];

    let currentTrackIndex = 0;
    let isPlaying = false;

    function toggleLofiBackground(playLofi: boolean) {
        if (!lofiBackgroundAudio) return;
        
        if (playLofi) {
            lofiBackgroundAudio.play().catch(e => console.log("Lofi auto-play blocked."));
            if (lofiBackgroundAudio) lofiBackgroundAudio.volume = parseFloat(volumeSlider?.value || '0.5') * LOFI_MAX_VOLUME_RATIO;
        } else {
            lofiBackgroundAudio.pause();
        }
    }

    function updateVolumeIcon(volume: number) {
        let iconClass = '';
        if (volume == 0) {
            iconClass = 'fas fa-volume-off';
        } else if (volume < 0.5) {
            iconClass = 'fas fa-volume-down';
        } else {
            iconClass = 'fas fa-volume-up';
        }
        if (volumeIconEl) {
            volumeIconEl.innerHTML = `<i class="${iconClass}"></i>`;
        }
    }

    function loadTrack(trackIndex: number, autoPlay = false) {
        const track = trackList[trackIndex];
        audioPlayer.src = track.src;
        if (songNameEl) songNameEl.textContent = track.name;
        if (artistNameEl) artistNameEl.textContent = track.artist;

        const albumArtMini = document.querySelector('.album-art-mini img');
        if (albumArtMini) {
            (albumArtMini as HTMLImageElement).src = track.cover;
        } else {
            const container = document.querySelector('.album-art-mini');
            if (container) {
                container.innerHTML = `<img src="${track.cover}" alt="Album Art" class="w-full h-full object-cover rounded-md">`;
            }
        }
        audioPlayer.load();

        isPlayConfirmed = !SPECIAL_TRACKS.includes(track.name);

        if (autoPlay && isPlayConfirmed) {
            audioPlayer.play().then(() => {
                isPlaying = true;
                updatePlayPauseIcon(isPlaying);
                toggleLofiBackground(false);
            }).catch(e => {
                console.error("Lỗi khi cố gắng phát nhạc tự động.", e);
                isPlaying = false;
                updatePlayPauseIcon(false);
                toggleLofiBackground(true);
            });
        } else {
            isPlaying = false;
            updatePlayPauseIcon(false);
            toggleLofiBackground(true);
        }
    }

    function playPauseTrack() {
        const currentTrackName = trackList[currentTrackIndex].name;

        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            updatePlayPauseIcon(isPlaying);
            toggleLofiBackground(true);
        } else {
            if (SPECIAL_TRACKS.includes(currentTrackName) && !isPlayConfirmed) {
            } else {
                lofiBackgroundAudio.muted = false;

                audioPlayer.play().then(() => {
                    isPlaying = true;
                    updatePlayPauseIcon(isPlaying);
                    toggleLofiBackground(false);
                }).catch(e => {
                    console.error("Lỗi khi cố gắng phát nhạc.", e);
                    isPlaying = false;
                    updatePlayPauseIcon(false);
                    toggleLofiBackground(true);
                });
            }
        }
    }

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
        loadTrack(currentTrackIndex, isPlaying);
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + trackList.length) % trackList.length;
        loadTrack(currentTrackIndex, isPlaying);
    }

    function updatePlayPauseIcon(playing: boolean) {
        if (playPauseIcon) {
            playPauseIcon.className = playing ? 'fas fa-pause' : 'fas fa-play';
        }
    }

    const formatTime = (time: number) => {
        if (!isFinite(time) || time < 0) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    audioPlayer.addEventListener('timeupdate', () => {
        const duration = audioPlayer.duration;
        const currentTime = audioPlayer.currentTime;
        if (isFinite(duration) && duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            if (progressEl) {
                progressEl.style.width = progressPercent + '%';
            }
            if (currentTimeEl) {
                currentTimeEl.textContent = formatTime(currentTime);
            }
        } else {
            if (currentTimeEl) {
                currentTimeEl.textContent = '0:00';
            }
        }
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        if (isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
            if (durationEl) {
                durationEl.textContent = formatTime(audioPlayer.duration);
            }
        }
    });

    audioPlayer.addEventListener('ended', () => {
        nextTrack();
    });

    if (progressContainer) {
        progressContainer.addEventListener('click', (e) => {
            const width = progressContainer.clientWidth;
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const duration = audioPlayer.duration;
            if (isFinite(duration) && duration > 0) {
                audioPlayer.currentTime = (clickX / width) * duration;
            }
        });
    }

    if (volumeSlider) {
        const volumeFill = document.getElementById('volume-fill');
        const volumeThumb = document.getElementById('volume-thumb');
        
        const updateVolumeSlider = () => {
            const value = parseFloat(volumeSlider.value);
            const percentage = value * 100;
            
            if (volumeFill) {
                volumeFill.style.width = `${percentage}%`;
            }
            if (volumeThumb) {
                volumeThumb.style.left = `calc(${percentage}% - 7px)`;
            }
        };
        
        volumeSlider.addEventListener('input', (e) => {
            const newVolume = parseFloat((e.target as HTMLInputElement).value);
            audioPlayer.volume = newVolume;
            if (lofiBackgroundAudio) lofiBackgroundAudio.volume = newVolume * LOFI_MAX_VOLUME_RATIO;
            updateVolumeIcon(audioPlayer.volume);
            updateVolumeSlider();
        });
        
        updateVolumeSlider();
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', playPauseTrack);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTrack);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', prevTrack);
    }

    loadTrack(currentTrackIndex);
    audioPlayer.volume = parseFloat(volumeSlider?.value || '0.5');
    if (lofiBackgroundAudio) lofiBackgroundAudio.volume = parseFloat(volumeSlider?.value || '0.5') * LOFI_MAX_VOLUME_RATIO;
    updateVolumeIcon(audioPlayer.volume);

    socialIcons.forEach(icon => {
        icon.classList.add('is-round');
        setTimeout(() => {
            icon.classList.remove('is-round');
        }, 1000);
    });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <video 
        id="video-background"
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="/video.mp4" type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ thẻ video.
      </video>

      <audio id="lofi-background-audio" loop autoPlay muted>
        <source src="/feelslikeimfallinginlove.mp3" type="audio/mpeg" />
        Trình duyệt của bạn không hỗ trợ audio.
      </audio>

      <div className="profile-container rounded-xl p-6 shadow-2xl">
        <div className="avatar-wrap">
          <div className="glow-ring"></div>
          <img src="/its6ueq.jfif" alt="Avatar" />
        </div>

        <h1 className="text-2xl font-bold mb-1">Nguyễn Duy Hải Bằng</h1>
        <p className="text-[#b9bbbe] text-sm mb-4">its6ueq</p>

        <div className="social-links flex justify-center mb-6">
          <a href="https://github.com/its6ueq" target="_blank" title="GitHub">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.facebook.com/not6ueq/" target="_blank" title="Facebook">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.linkedin.com/in/its6ueq" target="_blank" title="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="mailto:totenhaibang@gmail.com" target="_blank" title="Email">
            <i className="fas fa-envelope"></i>
          </a>
          <a href="/mini-apps" className="mini-apps-btn" title="Mini Apps">
            <i className="fas fa-th-large"></i>
          </a>
        </div>

        <div className="music-widget text-left">
          <p className="text-[#1ed760] font-semibold text-xs uppercase mb-2 flex items-center">
            <i className="fas fa-headphones mr-1"></i> Đang nghe nhạc Spotify
          </p>
          <div className="flex items-center">
            <div id="album-art-wrap" className="album-art-mini">
              <img src="/feelslikeimfallinginlove.png" alt="Album Art" className="w-full h-full object-cover rounded-md" />
            </div>
            <div className="flex-grow min-w-0">
              <p id="song-name" className="font-bold truncate text-lg">Tên Bài Hát</p>
              <p id="artist-name" className="text-[#b9bbbe] text-sm truncate">Nghệ Sĩ</p>
            </div>
          </div>
          <div className="mt-3">
            <div id="progress-container">
              <div id="progress"></div>
            </div>
            <div className="flex justify-between text-xs text-[#b9bbbe]">
              <span id="current-time">0:00</span>
              <span id="duration">0:00</span>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <div className="controls">
              <button id="prev-btn" title="Bài trước">
                <i className="fas fa-backward"></i>
              </button>
              <button id="play-pause-btn" className="text-3xl mx-4" title="Phát/Tạm dừng">
                <i id="play-pause-icon" className="fas fa-play"></i>
              </button>
              <button id="next-btn" title="Bài tiếp theo">
                <i className="fas fa-forward"></i>
              </button>
            </div>
          </div>
          <div className="volume-container">
            <div id="volume-icon" className="volume-icon">
              <i className="fas fa-volume-up"></i>
            </div>
            <div className="volume-slider-wrapper">
              <div className="volume-slider-track"></div>
              <div className="volume-slider-fill" id="volume-fill"></div>
              <input type="range" id="volume-slider" min="0" max="1" step="0.01" defaultValue="0.5" title="Âm lượng" />
              <div className="volume-slider-thumb" id="volume-thumb"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;