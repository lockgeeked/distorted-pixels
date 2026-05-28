import React, { useState } from 'react';

const WORDART_STYLES = [
  { id: 'rainbow', name: '🌈 Rainbow Gradient' },
  { id: 'sunset', name: '🌅 Sunset Orange' },
  { id: 'chrome', name: '💿 Metallic Chrome' },
  { id: 'neon', name: '🔮 Cyber Neon' }
];

const MemeTextEditor = ({ currentText, onApplyText, onClearText }) => {
  const [topText, setTopText] = useState(currentText.topText || '');
  const [bottomText, setBottomText] = useState(currentText.bottomText || '');
  const [wordArtText, setWordArtText] = useState(currentText.wordArtText || '');
  const [wordArtStyle, setWordArtStyle] = useState(currentText.wordArtStyle || 'rainbow');

  const handleApply = (e) => {
    e.preventDefault();
    onApplyText({
      topText,
      bottomText,
      wordArtText,
      wordArtStyle
    });
  };

  const handleClear = () => {
    setTopText('');
    setBottomText('');
    setWordArtText('');
    setWordArtStyle('rainbow');
    onClearText();
  };

  return (
    <form className="meme-editor-container" onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Top / Bottom text settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f5f5f5', padding: '12px', border: '2px solid #000' }}>
        <h4 style={{ margin: '0 0 5px 0', textTransform: 'uppercase', fontFamily: 'var(--title-font)' }}>Meme Captions (Impact Text)</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Top Text:</label>
          <input 
            type="text" 
            placeholder="TYPE TOP TEXT..."
            value={topText} 
            onChange={(e) => setTopText(e.target.value)}
            style={{ 
              padding: '6px 10px', 
              fontSize: '1rem', 
              fontFamily: 'Impact, sans-serif',
              textTransform: 'uppercase',
              border: '2px solid #000',
              borderRadius: 'var(--btn-radius)'
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Bottom Text:</label>
          <input 
            type="text" 
            placeholder="TYPE BOTTOM TEXT..."
            value={bottomText} 
            onChange={(e) => setBottomText(e.target.value)}
            style={{ 
              padding: '6px 10px', 
              fontSize: '1rem', 
              fontFamily: 'Impact, sans-serif',
              textTransform: 'uppercase',
              border: '2px solid #000',
              borderRadius: 'var(--btn-radius)'
            }}
          />
        </div>
      </div>

      {/* WordArt Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f5f5f5', padding: '12px', border: '2px solid #000' }}>
        <h4 style={{ margin: '0 0 5px 0', textTransform: 'uppercase', fontFamily: 'var(--title-font)' }}>WordArt (90s 3D Styles)</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>WordArt Text:</label>
          <input 
            type="text" 
            placeholder="Enter WordArt text..."
            value={wordArtText} 
            onChange={(e) => setWordArtText(e.target.value)}
            style={{ 
              padding: '6px 10px', 
              fontSize: '1rem', 
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              border: '2px solid #000',
              borderRadius: 'var(--btn-radius)'
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Style Preset:</label>
          <select 
            value={wordArtStyle} 
            onChange={(e) => setWordArtStyle(e.target.value)}
            style={{ 
              padding: '6px', 
              fontSize: '1rem', 
              border: '2px solid #000',
              borderRadius: 'var(--btn-radius)',
              background: '#fff',
              cursor: 'pointer'
            }}
          >
            {WORDART_STYLES.map(style => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
        <button 
          type="button" 
          className="btn" 
          onClick={handleClear}
          style={{ flex: 1, padding: '8px 12px', background: '#e0e0e0', color: '#000' }}
        >
          🗑️ Clear Text
        </button>
        <button 
          type="submit" 
          className="btn" 
          style={{ flex: 2, padding: '8px 12px', background: 'var(--accent-yellow)', color: '#000' }}
        >
          💾 Apply Text overlays
        </button>
      </div>
    </form>
  );
};

export default MemeTextEditor;
