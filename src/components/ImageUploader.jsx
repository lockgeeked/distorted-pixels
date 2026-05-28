import React, { useState, useRef, useEffect } from 'react';

const ImageUploader = ({ onUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const inputRef = useRef(null);
  const videoRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave' || e.type === 'drop') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    // Let the global drop handler in App.jsx take care of reading the file!
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onUpload(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  // Webcam controls
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      setVideoStream(stream);
      setShowWebcam(true);
    } catch (err) {
      alert("Cannot open webcam: " + err.message);
    }
  };

  const stopWebcam = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setShowWebcam(false);
  };

  useEffect(() => {
    if (showWebcam && videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [showWebcam, videoStream]);

  // Clean up stream if component unmounts
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoStream]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    // Draw mirrored video if helpful, but standard draw is fine
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    onUpload(dataUrl);
    stopWebcam();
  };

  return (
    <div 
      className={`uploader ${isDragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
    >
      <input 
        ref={inputRef}
        type="file" 
        accept="image/*" 
        onChange={handleChange} 
        style={{ display: 'none' }} 
      />

      {showWebcam ? (
        <div className="webcam-booth" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
          <div style={{ position: 'relative', border: '3px solid #000', background: '#000', width: '320px', height: '240px', overflow: 'hidden' }}>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn" onClick={handleCapture} style={{ background: 'var(--accent-yellow)', color: '#000', padding: '6px 16px' }}>
              📸 Capture
            </button>
            <button className="btn" onClick={stopWebcam} style={{ background: '#ff3b30', color: '#fff', padding: '6px 16px' }}>
              ❌ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="choose-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAHBJREFUWEft0rENgCAQBVDbwmWcxDWM07iMUzAxMDBqKyEh7Z/wHsn18t7Li8wY4713r3ePme7sVfF9B2DkfwQAhIQAhIQAhIQAhIQAhIQA34C511/kKQD+/EIAQkIAQkIAQkIAQkIAQkIAQkLgO8ADdts/m+EaD8QAAAAASUVORK5CYII=" alt="Folder" style={{width: '64px', height: '64px', imageRendering: 'pixelated', marginBottom: '1rem', background: 'transparent'}}/>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button className="btn" onClick={onButtonClick} style={{ padding: '8px 16px' }}>
              Browse File...
            </button>
            <button className="btn" onClick={startWebcam} style={{ padding: '8px 16px', background: 'var(--accent-orange)', color: '#fff' }}>
              📷 Camera Booth
            </button>
          </div>
          
          <div className="upload-options">
            <p>Drag and drop supported.</p>
            <p>Ctrl+V to paste image.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
