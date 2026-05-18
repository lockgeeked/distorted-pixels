import React, { useState } from 'react';

const Window = ({ 
  title, 
  onClose, 
  children, 
  defaultPosition = { x: 50, y: 50 }, 
  width = '400px', 
  height = 'auto',
  minimized: controlledMinimized,
  onMinimize
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [localMinimized, setLocalMinimized] = useState(false);

  const isMinimized = controlledMinimized !== undefined ? controlledMinimized : localMinimized;

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    } else {
      setLocalMinimized(!localMinimized);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="window floating-window"
      style={{ 
        left: position.x, 
        top: position.y, 
        width, 
        height, 
        position: 'absolute', 
        zIndex: 100,
        display: isMinimized ? 'none' : 'flex',
        flexDirection: 'column'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="window-title-bar" onMouseDown={handleMouseDown} style={{ cursor: 'move' }}>
        <span>{title}</span>
        <div className="window-title-buttons">
          <button className="window-btn" onMouseDown={(e) => e.stopPropagation()} onClick={handleMinimize}>_</button>
          <button className="window-btn" onMouseDown={(e) => e.stopPropagation()} onClick={onClose} style={{fontWeight: 'bold'}}>X</button>
        </div>
      </div>
      <div className="window-content" style={{ background: 'var(--win-bg)', minHeight: '100px', overflowY: 'auto', maxHeight: '600px' }}>
        {children}
      </div>
    </div>
  );
};

export default Window;
