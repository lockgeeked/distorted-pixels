import { useState, useRef, useEffect } from 'react'
import './index.css'
import ImageUploader from './components/ImageUploader'
import CanvasPreview from './components/CanvasPreview'
import Controls from './components/Controls'

function App() {
  const [imageSrc, setImageSrc] = useState(null)
  const [filters, setFilters] = useState({
    deepFry: { active: false, intensity: 50 },
    glitch: { active: false, intensity: 50 },
    wave: { active: false, intensity: 50 },
    pixelate: { active: false, intensity: 50 },
    frying: { active: false },
    cursedColors: { active: false }
  })
  
  const [jpegSettings, setJpegSettings] = useState({
    active: false,
    fryCount: 25,
    fryQuality: 30,
    maxResolution: 0.125
  })
  
  const canvasRef = useRef(null)

  useEffect(() => {
    const processFileGlobal = (file) => {
      if (!file.type.match('image.*')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    };

    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          processFileGlobal(file);
          break;
        }
      }
    };

    const handleGlobalDragOver = (e) => {
      e.preventDefault();
    };

    const handleGlobalDrop = (e) => {
      e.preventDefault();
      if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
        processFileGlobal(e.dataTransfer.files[0]);
      }
    };

    window.addEventListener('paste', handlePaste);
    window.addEventListener('dragover', handleGlobalDragOver);
    window.addEventListener('drop', handleGlobalDrop);

    return () => {
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('dragover', handleGlobalDragOver);
      window.removeEventListener('drop', handleGlobalDrop);
    };
  }, []);

  const handleImageUpload = (src) => {
    setImageSrc(src)
  }

  const handleFilterChange = (filterName, type, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: {
        ...prev[filterName],
        [type]: value
      }
    }))
  }

  const handleJpegSettingChange = (setting, value) => {
    setJpegSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handleDownload = () => {
    if (!canvasRef.current || !imageSrc) return
    const link = document.createElement('a')
    link.download = 'distorted-pixels.jpg'
    // Ensure we save as jpg to keep the artifacts!
    link.href = canvasRef.current.toDataURL('image/jpeg', 0.9)
    link.click()
  }

  return (
    <div className="app-container">
      <header>
        <h1>Distorted Pixels</h1>
        <p>deep fried image generator</p>
      </header>

      <main>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {!imageSrc ? (
            <ImageUploader onUpload={handleImageUpload} />
          ) : (
            <div className="canvas-container">
              <CanvasPreview 
                imageSrc={imageSrc} 
                filters={filters} 
                jpegSettings={jpegSettings}
                canvasRef={canvasRef}
              />
              <button className="btn btn-secondary" onClick={() => setImageSrc(null)} style={{marginTop: '1rem'}}>
                Upload New Image
              </button>
            </div>
          )}
        </div>

        <div className="glass-panel">
          <Controls 
            filters={filters} 
            jpegSettings={jpegSettings}
            onChange={handleFilterChange} 
            onJpegChange={handleJpegSettingChange}
            onDownload={handleDownload}
            disabled={!imageSrc}
          />
        </div>
      </main>
    </div>
  )
}

export default App
