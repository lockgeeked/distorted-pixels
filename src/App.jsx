import { useState, useRef, useEffect } from 'react'
import './index.css'
import ImageUploader from './components/ImageUploader'
import CanvasPreview from './components/CanvasPreview'
import Controls from './components/Controls'
import Window from './components/Window'

const DEFAULT_FILTERS = {
  deepFry: { active: false, intensity: 50 },
  glitch: { active: false, intensity: 50 },
  wave: { active: false, intensity: 50 },
  pixelate: { active: false, intensity: 50 },
  frying: { active: false },
  cursedColors: { active: false }
};

const DEFAULT_JPEG_SETTINGS = {
  active: false,
  fryCount: 25,
  fryQuality: 30,
  maxResolution: 0.125
};

function App() {
  const [imageSrc, setImageSrc] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [jpegSettings, setJpegSettings] = useState(DEFAULT_JPEG_SETTINGS)
  
  // OS State
  const [openWindows, setOpenWindows] = useState([])
  const [deletedImages, setDeletedImages] = useState([]) // Array of { src: string, origin: 'canvas' | 'gallery' }
  const [savedImages, setSavedImages] = useState([])
  const [viewingImage, setViewingImage] = useState(null) // { src: string, index: number, source: 'gallery' | 'recycle-bin', origin?: string }

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

  const handleClearImage = () => {
    if (imageSrc) {
      setDeletedImages(prev => [{ src: imageSrc, origin: 'canvas' }, ...prev]);
      setImageSrc(null);
    }
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
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9)
    setSavedImages(prev => [dataUrl, ...prev]);
    const link = document.createElement('a')
    link.download = 'distorted-pixels.jpg'
    link.href = dataUrl
    link.click()
  }

  const openWindow = (id) => {
    if (!openWindows.includes(id)) {
      setOpenWindows([...openWindows, id]);
    }
  }

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(w => w !== id));
  }

  return (
    <div className="app-container">
      <div className="desktop-icon-container">
        <div className="desktop-icon" style={{background: 'var(--accent-yellow)'}} onClick={() => openWindow('my-computer')}>
          <div style={{fontSize: '40px'}}>💻</div>
          <span>Computer</span>
        </div>
        <div className="desktop-icon" style={{background: 'var(--accent-pink)'}} onClick={() => openWindow('recycle-bin')}>
          <div style={{fontSize: '40px'}}>🗑️</div>
          <span>Trash</span>
        </div>
      </div>

      {openWindows.includes('recycle-bin') && (
        <Window title="Recycle Bin" onClose={() => closeWindow('recycle-bin')} defaultPosition={{x: 100, y: 100}} width="500px">
          <div style={{padding: '10px'}}>
            <button className="btn" onClick={() => {
              setFilters(DEFAULT_FILTERS);
              setJpegSettings(DEFAULT_JPEG_SETTINGS);
              setDeletedImages([]);
              if (imageSrc) {
                  setImageSrc(null);
              }
              alert("Settings reset and Trash emptied.");
            }} style={{marginBottom: '1rem'}}>
              Empty Trash & Factory Reset
            </button>
            <p style={{marginBottom: '10px'}}>Click an image to view options:</p>
            {deletedImages.length === 0 ? (
              <p style={{color: '#666'}}>The Recycle Bin is empty.</p>
            ) : (
              <div className="grid-container">
                {deletedImages.map((item, i) => (
                  <div className="grid-item" key={i} onClick={() => {
                    setViewingImage({src: item.src, index: i, source: 'recycle-bin', origin: item.origin});
                    openWindow('image-viewer');
                  }}>
                    <img src={item.src} alt={`Deleted ${i}`} />
                    <span>Deleted_{i+1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Window>
      )}

      {openWindows.includes('my-computer') && (
        <Window title="My Computer" onClose={() => closeWindow('my-computer')} defaultPosition={{x: 150, y: 80}} width="450px">
          <div className="grid-container">
             <div className="grid-item" onClick={() => openWindow('system-properties')}>
               <div style={{fontSize: '32px'}}>⚙️</div>
               <span>System Properties</span>
             </div>
             <div className="grid-item" onClick={() => openWindow('c-drive')}>
               <div style={{fontSize: '32px'}}>💾</div>
               <span>Local Disk (C:)</span>
             </div>
             <div className="grid-item" onClick={() => openWindow('gallery')}>
               <div style={{fontSize: '32px'}}>🖼️</div>
               <span>Gallery (D:)</span>
             </div>
          </div>
        </Window>
      )}

      {openWindows.includes('system-properties') && (
        <Window title="System Properties" onClose={() => closeWindow('system-properties')} defaultPosition={{x: 250, y: 150}} width="400px">
          <div style={{padding: '15px', display: 'flex', gap: '15px'}}>
             <div style={{fontSize: '48px'}}>💻</div>
             <div>
               <h3 style={{marginBottom: '10px'}}>System:</h3>
               <p>Distorted Pixels OS 95</p>
               <p>Version 4.00.950</p>
               <h3 style={{margin: '10px 0'}}>Computer:</h3>
               <p>Intel Pentium Processor</p>
               <p>16.0MB RAM</p>
               <h3 style={{margin: '10px 0'}}>Browser:</h3>
               <p style={{fontSize: '0.8rem', wordBreak: 'break-all'}}>{navigator.userAgent}</p>
             </div>
          </div>
        </Window>
      )}

      {openWindows.includes('c-drive') && (
        <Window title="Local Disk (C:) - Samples" onClose={() => closeWindow('c-drive')} defaultPosition={{x: 200, y: 200}} width="500px">
          <div style={{padding: '10px'}}>
            <p style={{marginBottom: '10px'}}>Double-click to load sample image:</p>
            <div className="grid-container">
               {['https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&h=300&fit=crop', 
                 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=300&h=300&fit=crop',
                 'https://images.unsplash.com/photo-1525609004556-c46dce3100bc?w=300&h=300&fit=crop'].map((src, i) => (
                 <div className="grid-item" key={i} onClick={() => setImageSrc(src)}>
                   <img src={src} alt="Sample" />
                   <span>Sample_{i+1}.jpg</span>
                 </div>
               ))}
            </div>
          </div>
        </Window>
      )}

      {openWindows.includes('gallery') && (
        <Window title="Gallery (D:) - Saved Images" onClose={() => closeWindow('gallery')} defaultPosition={{x: 300, y: 120}} width="500px">
          <div style={{padding: '10px'}}>
             {savedImages.length === 0 ? (
               <p style={{color: '#666'}}>No images saved yet. Click "Save As..." to save here.</p>
             ) : (
               <div className="grid-container">
                 {savedImages.map((src, i) => (
                   <div className="grid-item" key={i} onClick={() => {
                     setViewingImage({src, index: i, source: 'gallery'});
                     openWindow('image-viewer');
                   }}>
                     <img src={src} alt={`Saved ${i}`} style={{width: '64px', height: '64px'}}/>
                     <span>Meme_{i+1}.jpg</span>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </Window>
      )}

      {openWindows.includes('image-viewer') && viewingImage && (
        <Window 
          title={`Viewing Image`} 
          onClose={() => {
            closeWindow('image-viewer');
            setViewingImage(null);
          }} 
          defaultPosition={{x: 350, y: 100}} 
          width="400px"
        >
          <div style={{padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px'}}>
            <img src={viewingImage.src} alt="Viewing" style={{maxWidth: '100%', border: '2px solid var(--win-border-dark)', boxShadow: 'inset 1px 1px var(--win-border-mid)'}} />
            <div style={{display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', flexWrap: 'wrap'}}>
              <button className="btn" onClick={() => {
                const link = document.createElement('a');
                link.download = `DistortedPixel_${Date.now()}.jpg`;
                link.href = viewingImage.src;
                link.click();
              }}>
                💾 Download
              </button>
              
              {viewingImage.source === 'gallery' && (
                <button className="btn" onClick={() => {
                  setSavedImages(prev => prev.filter((_, i) => i !== viewingImage.index));
                  setDeletedImages(prev => [{ src: viewingImage.src, origin: 'gallery' }, ...prev]);
                  closeWindow('image-viewer');
                  setViewingImage(null);
                }}>
                  🗑️ Move to Trash
                </button>
              )}

              {viewingImage.source === 'recycle-bin' && (
                <>
                  <button className="btn" onClick={() => {
                    // Restore back to original location
                    if (viewingImage.origin === 'gallery') {
                      setSavedImages(prev => [viewingImage.src, ...prev]);
                    } else {
                      setImageSrc(viewingImage.src);
                    }
                    setDeletedImages(prev => prev.filter((_, i) => i !== viewingImage.index));
                    closeWindow('image-viewer');
                    setViewingImage(null);
                  }}>
                    ♻️ Restore
                  </button>
                  <button className="btn" onClick={() => {
                    setDeletedImages(prev => prev.filter((_, i) => i !== viewingImage.index));
                    closeWindow('image-viewer');
                    setViewingImage(null);
                  }}>
                    ❌ Delete Forever
                  </button>
                </>
              )}
            </div>
          </div>
        </Window>
      )}

      <main>
        <div className="window">
          <div className="window-title-bar">
            <span>C:\\DistortedPixels.exe</span>
            <div className="window-title-buttons">
              <button className="window-btn">_</button>
              <button className="window-btn">☐</button>
              <button className="window-btn" style={{fontWeight: 'bold'}}>X</button>
            </div>
          </div>
          <div className="window-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', background: 'var(--win-bg)', minHeight: '400px' }}>
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
                <button className="btn" onClick={handleClearImage} style={{marginTop: '1rem'}}>
                  Clear Image
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="window">
          <div className="window-title-bar">
            <span>Controls</span>
            <div className="window-title-buttons">
              <button className="window-btn">_</button>
              <button className="window-btn">☐</button>
              <button className="window-btn" style={{fontWeight: 'bold'}}>X</button>
            </div>
          </div>
          <div className="window-content" style={{background: 'var(--win-bg)'}}>
            <Controls 
              filters={filters} 
              jpegSettings={jpegSettings}
              onChange={handleFilterChange} 
              onJpegChange={handleJpegSettingChange}
              onDownload={handleDownload}
              disabled={!imageSrc}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
