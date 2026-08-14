import React, { useState, useRef, useEffect } from 'react';

const TRACKS = ["/music.mp3", "/music2.mp3"];

const MediaPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  
  const audioRef = useRef(null);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Track change / Playback sync
  useEffect(() => {
    setCurrentTime(0);
    setSeekTime(0);
    setDuration(0);
    setIsSeeking(false);

    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

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
    if (audioRef.current && !isSeeking) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      setSeekTime(time);
    }
  };

  const updateDuration = () => {
    if (audioRef.current) {
      const d = audioRef.current.duration;
      if (Number.isFinite(d) && d > 0) {
        setDuration(d);
      }
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekInput = (e) => {
    const newTime = parseFloat(e.target.value);
    setSeekTime(newTime);
  };

  const handleSeekCommit = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current && Number.isFinite(newTime)) {
      try {
        audioRef.current.currentTime = newTime;
      } catch (err) {
        console.warn("Audio seek error:", err);
      }
      setCurrentTime(newTime);
      setSeekTime(newTime);
    }
    setIsSeeking(false);
  };

  const handleSliderChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current && Number.isFinite(newTime)) {
      try {
        audioRef.current.currentTime = newTime;
      } catch (err) {
        console.warn("Audio seek error:", err);
      }
      setCurrentTime(newTime);
      setSeekTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time) || time < 0) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const displayTime = isSeeking ? seekTime : currentTime;
  const maxSeek = duration > 0 ? duration : 100;

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
        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--win-text)', minWidth: '45px' }}>
          {formatTime(displayTime)}
        </span>
        <input 
          type="range" 
          min="0" 
          max={maxSeek} 
          step="0.1" 
          value={displayTime} 
          onMouseDown={handleSeekStart}
          onTouchStart={handleSeekStart}
          onInput={handleSeekInput}
          onChange={handleSliderChange}
          onMouseUp={handleSeekCommit}
          onTouchEnd={handleSeekCommit}
          onKeyUp={handleSeekCommit}
          disabled={duration === 0}
          style={{ flex: 1, cursor: duration === 0 ? 'wait' : 'pointer' }}
          title={duration === 0 ? "Loading track..." : "Seek"}
        />
        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--win-text)', minWidth: '45px', textAlign: 'right' }}>
          {formatTime(duration)}
        </span>
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
        preload="metadata"
        onEnded={nextTrack}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={updateDuration}
        onDurationChange={updateDuration}
        onCanPlay={updateDuration}
        onLoadedData={updateDuration}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default MediaPlayer;
