import React, { useRef, useState, useEffect } from 'react';

const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#ffffff' },
  { name: 'Red', value: '#ff0000' },
  { name: 'Green', value: '#00ff00' },
  { name: 'Blue', value: '#0000ff' },
  { name: 'Yellow', value: '#ffff00' },
  { name: 'Orange', value: '#ffaa00' },
  { name: 'Purple', value: '#8b00ff' },
  { name: 'Pink', value: '#ff69b4' }
];

const Paint = ({ imageSrc, onApplyDoodle, onClearDoodle, currentDoodle }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(8);
  const [tool, setTool] = useState('brush'); // 'brush' or 'eraser'
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 300 });

  // Adjust canvas size to match image aspect ratio if imageSrc is present
  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        // Limit max dimensions for the editor
        const maxW = 500;
        const maxH = 400;
        let w = img.width;
        let h = img.height;
        const scale = Math.min(maxW / w, maxH / h, 1);
        setCanvasSize({ width: Math.floor(w * scale), height: Math.floor(h * scale) });
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  // Load existing doodle if present when canvas is ready
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (currentDoodle) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = currentDoodle;
    }
  }, [currentDoodle, canvasSize]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Support touch and mouse events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const startDrawing = (e) => {
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
    }

    // Draw a single dot on click
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Check if canvas is completely empty (no drawings)
    const ctx = canvas.getContext('2d');
    const buffer = new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
    const isEmpty = !buffer.some(color => color !== 0);

    if (isEmpty) {
      onClearDoodle();
    } else {
      const dataUrl = canvas.toDataURL('image/png');
      onApplyDoodle(dataUrl);
    }
  };

  return (
    <div className="paint-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div 
        className="paint-board-wrapper" 
        style={{ 
          position: 'relative', 
          width: canvasSize.width, 
          height: canvasSize.height,
          background: '#eee',
          border: 'var(--border-width) solid var(--border-color)',
          margin: '0 auto',
          overflow: 'hidden'
        }}
      >
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt="Paint Background" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              opacity: 0.8
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#888',
            fontStyle: 'italic',
            pointerEvents: 'none'
          }}>
            Canvas (No Background Image)
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: tool === 'eraser' ? 'crosshair' : 'pencil',
            zIndex: 2
          }}
        />
      </div>

      {/* Paint Controls */}
      <div className="paint-controls" style={{ background: '#f0f0f0', padding: '10px', border: '2px solid #000', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Tools */}
          <div style={{ display: 'flex', gap: '5px' }}>
            <button 
              className={`btn ${tool === 'brush' ? 'active' : ''}`} 
              onClick={() => setTool('brush')}
              style={{ padding: '4px 10px', fontSize: '0.9rem', background: tool === 'brush' ? 'var(--accent-purple)' : '#fff' }}
            >
              🖌️ Brush
            </button>
            <button 
              className={`btn ${tool === 'eraser' ? 'active' : ''}`} 
              onClick={() => setTool('eraser')}
              style={{ padding: '4px 10px', fontSize: '0.9rem', background: tool === 'eraser' ? 'var(--accent-purple)' : '#fff' }}
            >
              🧽 Eraser
            </button>
          </div>

          {/* Size */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Size: {brushSize}px</label>
            <input 
              type="range" 
              min="2" 
              max="40" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              style={{ width: '100px', height: '10px' }}
            />
          </div>
        </div>

        {/* Colors */}
        {tool === 'brush' && (
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', padding: '5px', background: '#fff', border: '1px solid #000' }}>
            {COLORS.map(c => (
              <button
                key={c.name}
                title={c.name}
                onClick={() => setBrushColor(c.value)}
                style={{
                  width: '24px',
                  height: '24px',
                  background: c.value,
                  border: brushColor === c.value ? '3px solid var(--accent-orange)' : '1px solid #000',
                  cursor: 'pointer',
                  borderRadius: '2px'
                }}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
          <button className="btn" onClick={handleClear} style={{ flex: 1, padding: '6px 12px', fontSize: '0.95rem', background: '#e0e0e0', color: '#000' }}>
            🗑️ Clear Canvas
          </button>
          <button className="btn" onClick={handleApply} style={{ flex: 1.5, padding: '6px 12px', fontSize: '0.95rem', background: 'var(--accent-yellow)', color: '#000' }}>
            💾 Apply to Editor
          </button>
          {currentDoodle && (
            <button className="btn" onClick={onClearDoodle} style={{ padding: '6px 12px', fontSize: '0.95rem', background: '#ff3b30', color: '#fff' }}>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Paint;
