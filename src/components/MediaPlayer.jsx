import React, { useState, useRef, useEffect } from 'react';

const TRACKS = ["/music.mp3", "/music2.mp3"];

const MediaPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Audio playback failed", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', width: '100%' }}>
      
      {/* Retro LCD Display */}
      <div style={{ 
        background: 'var(--lcd-bg, #000000)', 
        color: 'var(--lcd-text, #00ff00)', 
        width: '100%', 
        padding: '12px 10px', 
        textAlign: 'center', 
        border: 'var(--border-width) solid var(--border-color)', 
        fontFamily: "var(--title-font), monospace",
        fontSize: '1.4rem',
        textTransform: 'uppercase',
        boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        borderRadius: 'var(--card-radius)'
      }}>
        {isPlaying ? (
          <marquee scrollamount="5">▶ NOW PLAYING: TRACK {currentTrackIndex + 1} / {TRACKS.length} </marquee>
        ) : (
          <div>PAUSED - TRACK {currentTrackIndex + 1}</div>
        )}
      </div>
      
      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
        <button className="btn" onClick={prevTrack} style={{ padding: '8px 16px', borderRadius: 'var(--btn-radius)' }}>⏮️</button>
        <button className="btn" onClick={togglePlay} style={{ background: 'var(--accent-pink)', padding: '8px 24px', borderRadius: 'var(--btn-radius)' }}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button className="btn" onClick={nextTrack} style={{ padding: '8px 16px', borderRadius: 'var(--btn-radius)' }}>⏭️</button>
      </div>

      {/* Seek Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', marginTop: '5px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--win-text)' }}>{formatTime(currentTime)}</span>
        <input 
          type="range" 
          min="0" 
          max={duration || 0} 
          step="0.1" 
          value={currentTime} 
          onChange={handleSeek}
          style={{ flex: 1 }}
        />
        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--win-text)' }}>{formatTime(duration)}</span>
      </div>

      {/* Volume Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', marginTop: '5px' }}>
        <span style={{ fontSize: '1.2rem' }}>🔈</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: '1.2rem' }}>🔊</span>
      </div>

      {/* Native HTML5 Audio */}
      <audio 
        ref={audioRef} 
        src={TRACKS[currentTrackIndex]} 
        onEnded={nextTrack}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default MediaPlayer;
