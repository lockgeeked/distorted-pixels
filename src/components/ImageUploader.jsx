import React, { useState, useRef, useEffect } from 'react';

const ImageUploader = ({ onUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef(null);

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

  return (
    <div 
      className={`uploader ${isDragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        ref={inputRef}
        type="file" 
        accept="image/*" 
        onChange={handleChange} 
        style={{ display: 'none' }} 
      />
      
      <div className="choose-section">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAHBJREFUWEft0rENgCAQBVDbwmWcxDWM07iMUzAxMDBqKyEh7Z/wHsn18t7Li8wY4713r3ePme7sVfF9B2DkfwQAhIQAhIQAhIQAhIQAhIQA34C511/kKQD+/EIAQkIAQkIAQkIAQkIAQkIAQkLgO8ADdts/m+EaD8QAAAAASUVORK5CYII=" alt="Folder" style={{width: '64px', height: '64px', imageRendering: 'pixelated', marginBottom: '1rem', background: 'transparent'}}/>
        <button className="btn" onClick={onButtonClick}>
          Browse...
        </button>
        <div className="upload-options">
          <p>Drag and drop supported.</p>
          <p>Ctrl+V to paste image.</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
