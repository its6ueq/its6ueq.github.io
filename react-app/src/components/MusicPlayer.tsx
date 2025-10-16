import React, { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';

interface Track {
  name: string;
  artist: string;
  src: string;
  cover: string;
}

interface MusicPlayerProps {
  tracks: Track[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ tracks }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const lofiAudioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
    }
  }, [currentTrackIndex, currentTrack.src]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => nextTrack();
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (lofiAudioRef.current) {
      lofiAudioRef.current.volume = newVolume * 0.2;
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time) || time < 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const getVolumeIcon = () => {
    if (volume === 0) return 'fas fa-volume-off';
    if (volume < 0.5) return 'fas fa-volume-down';
    return 'fas fa-volume-up';
  };

  return (
    <div className="music-widget">
      <p className="music-status">
        <i className="fas fa-headphones"></i> Đang nghe nhạc Spotify
      </p>
      
      <div className="track-info">
        <div className="album-art">
          <img src={currentTrack.cover} alt="Album Art" />
        </div>
        <div className="track-details">
          <p className="track-name">{currentTrack.name}</p>
          <p className="track-artist">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-container" onClick={handleProgressClick}>
          <div 
            className="progress-bar" 
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <div className="time-info">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="controls">
        <button onClick={prevTrack} title="Bài trước">
          <i className="fas fa-backward"></i>
        </button>
        <button onClick={togglePlayPause} className="play-pause-btn" title="Phát/Tạm dừng">
          <i className={isPlaying ? 'fas fa-pause' : 'fas fa-play'}></i>
        </button>
        <button onClick={nextTrack} title="Bài tiếp theo">
          <i className="fas fa-forward"></i>
        </button>
      </div>

      <div className="volume-control">
        <i className={getVolumeIcon()}></i>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          title="Âm lượng"
        />
      </div>

      <audio ref={audioRef} />
      <audio ref={lofiAudioRef} loop muted>
        <source src="/feelslikeimfallinginlove.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default MusicPlayer;
