import React from 'react';

const THEMES = [
  {
    id: 'classic',
    name: 'Classic Brutalist',
    bg: '#55c57a',
    accent: '#ff90e8',
    text: '#000000',
    description: 'The original mint green, sharp-cornered brutalist OS design.',
    previewTitleFont: "'Space Grotesk', sans-serif"
  },
  {
    id: 'weirdos',
    name: 'The Weirdos Web3',
    bg: '#fed049',
    accent: '#f07167',
    text: '#000000',
    description: 'Warm yellow background, rounded corners, and chunky Bebas Neue typography.',
    previewTitleFont: "'Bebas Neue', sans-serif"
  },
  {
    id: 'dark',
    name: 'Cyberpunk Dark',
    bg: '#121214',
    accent: '#bd93f9',
    text: '#ffffff',
    description: 'Deep charcoal background, purple glowing accents, and neon elements.',
    previewTitleFont: "'Space Grotesk', sans-serif"
  }
];

const ThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
        Select a theme to transform the entire desktop layout, window borders, shapes, and typography:
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {THEMES.map((theme) => (
          <div
            key={theme.id}
            className={`theme-preview-card ${currentTheme === theme.id ? 'selected' : ''}`}
            onClick={() => onThemeChange(theme.id)}
            style={{
              background: theme.id === 'dark' ? '#1e1e24' : '#ffffff',
              color: theme.id === 'dark' ? '#ffffff' : '#000000',
              border: 'var(--border-width) solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontFamily: theme.previewTitleFont, fontSize: '1.3rem', letterSpacing: '0.5px' }}>
                {theme.name}
              </h3>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: theme.bg,
                  border: '2px solid var(--border-color)'
                }} />
                <span style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: theme.accent,
                  border: '2px solid var(--border-color)'
                }} />
              </div>
            </div>
            
            <p style={{ fontSize: '0.95rem', margin: 0, opacity: 0.8 }}>
              {theme.description}
            </p>
            
            {/* Visual Mini Mockup */}
            <div style={{
              marginTop: '10px',
              padding: '8px',
              background: theme.bg,
              borderRadius: theme.id === 'weirdos' ? '10px' : theme.id === 'dark' ? '6px' : '0px',
              border: '2px solid var(--border-color)',
              display: 'flex',
              gap: '6px',
              alignItems: 'center'
            }}>
              {/* Fake Window */}
              <div style={{
                flex: 1,
                background: theme.id === 'dark' ? '#1e1e24' : '#ffffff',
                border: '2px solid var(--border-color)',
                borderRadius: theme.id === 'weirdos' ? '8px' : theme.id === 'dark' ? '4px' : '0px',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: theme.id === 'dark' ? '#2d2d37' : theme.id === 'weirdos' ? '#ffffff' : theme.accent,
                  height: '16px',
                  borderBottom: '2px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 4px'
                }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#000', marginRight: 'auto' }} />
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.accent }} />
                </div>
                <div style={{ height: '20px' }} />
              </div>
              
              {/* Fake Button */}
              <div style={{
                background: theme.id === 'weirdos' ? '#000000' : theme.accent,
                color: theme.id === 'weirdos' ? '#ffffff' : '#000000',
                padding: '4px 8px',
                fontSize: '0.7rem',
                border: '2px solid var(--border-color)',
                borderRadius: theme.id === 'weirdos' ? '99px' : theme.id === 'dark' ? '4px' : '0px',
                fontFamily: theme.previewTitleFont,
                textAlign: 'center'
              }}>
                Button
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
