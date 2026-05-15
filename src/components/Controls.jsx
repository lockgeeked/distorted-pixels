import React from 'react';

const Controls = ({ filters, jpegSettings, onChange, onJpegChange, onDownload, disabled }) => {
  const renderControlGroup = (title, filterKey) => {
    const filter = filters[filterKey];
    return (
      <div className="controls-group" key={filterKey}>
        <h3>
          {title}
          <div className="checkbox-container">
            <input 
              type="checkbox" 
              checked={filter.active} 
              onChange={(e) => onChange(filterKey, 'active', e.target.checked)}
              disabled={disabled}
            />
          </div>
        </h3>
        {filter.active && (
          <div className="control-item">
            <label>
              Intensity <span>{filter.intensity}%</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={filter.intensity}
              onChange={(e) => onChange(filterKey, 'intensity', parseInt(e.target.value))}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="info-box">
        <h2>info</h2>
        <p>Distorted Pixels is the ultimate distortion playground for creators who love twisting pictures into cursed. We take your normal photos, artworks, or screenshots and brutally deep-fry, glitch, Wave, and distort them into something hilariously cursed or beautifully broken.</p>
      </div>

      <div className="controls-box">
        <h2>JPEG settings</h2>
        
        <div className="select-group">
          <label>How many times to fry</label>
          <select 
            value={jpegSettings.fryCount} 
            onChange={(e) => onJpegChange('fryCount', parseInt(e.target.value))}
            disabled={disabled}
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div className="select-group">
          <label>Fry quality per step (approximate)</label>
          <select 
            value={jpegSettings.fryQuality} 
            onChange={(e) => onJpegChange('fryQuality', parseInt(e.target.value))}
            disabled={disabled}
          >
            <option value="0">0%</option>
            <option value="1">1%</option>
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="20">20%</option>
            <option value="30">30%</option>
            <option value="40">40%</option>
            <option value="50">50%</option>
          </select>
        </div>

        <div className="select-group">
          <label>Maximum image resolution</label>
          <select 
            value={jpegSettings.maxResolution} 
            onChange={(e) => onJpegChange('maxResolution', e.target.value === 'original' ? 'original' : parseFloat(e.target.value))}
            disabled={disabled}
          >
            <option value="original">original</option>
            <option value="0.0625">1/16 megapixels</option>
            <option value="0.125">1/8 megapixels</option>
            <option value="0.25">1/4 megapixels</option>
            <option value="0.5">1/2 megapixels</option>
            <option value="1">1 megapixels</option>
            <option value="2">2 megapixels</option>
          </select>
        </div>

        <div className="control-item" style={{marginTop: '1.5rem', marginBottom: '0'}}>
           <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
             <span style={{flex: 1, color: '#000', fontWeight: 'bold'}}>Apply Compression</span>
             <div className="checkbox-container">
              <input 
                type="checkbox" 
                checked={jpegSettings.active} 
                onChange={(e) => onJpegChange('active', e.target.checked)}
                disabled={disabled}
              />
            </div>
           </label>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--win-border-dark)', paddingBottom: '0.2rem', marginTop: '1.5rem', color: '#000' }}>Quick Apply</h2>
      
      <div className="controls-group" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#e0e0e0' }}>
        <h3 style={{ marginBottom: 0 }}>
          <span>Frying</span>
          <div className="checkbox-container">
            <input 
              type="checkbox" 
              checked={filters.frying.active} 
              onChange={(e) => onChange('frying', 'active', e.target.checked)}
              disabled={disabled}
            />
          </div>
        </h3>
        <h3 style={{ marginBottom: 0 }}>
          <span>True Colour</span>
          <div className="checkbox-container">
            <input 
              type="checkbox" 
              checked={filters.cursedColors.active} 
              onChange={(e) => onChange('cursedColors', 'active', e.target.checked)}
              disabled={disabled}
            />
          </div>
        </h3>
      </div>

      <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--win-border-dark)', paddingBottom: '0.2rem', marginTop: '1.5rem', color: '#000' }}>Extra Filters</h2>
      
      {renderControlGroup('Deep Fry', 'deepFry')}
      {renderControlGroup('Glitch', 'glitch')}
      {renderControlGroup('Wave', 'wave')}
      {renderControlGroup('Pixelate', 'pixelate')}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          className="btn" 
          onClick={onDownload} 
          disabled={disabled}
          style={{ width: '100%', opacity: disabled ? 0.7 : 1, padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}
        >
          ⬇ Save As...
        </button>
      </div>
    </div>
  );
};

export default Controls;
