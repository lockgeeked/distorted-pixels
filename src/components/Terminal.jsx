import React, { useState, useRef, useEffect } from 'react';

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "Your image is so deep fried, KFC wants to patent the recipe.",
  "Error 404: Quality not found. Compression artifacts at 100%.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "There are 10 types of people: those who understand binary, and those who don't.",
  "C:\\> rm -rf /  ... Just kidding. Unless? 👁️",
  "Deep frying is like programming: if you add enough salt, it suddenly works."
];

const FILES = [
  { name: 'App.jsx', size: '27.8 KB' },
  { name: 'index.css', size: '22.3 KB' },
  { name: 'CanvasPreview.jsx', size: '8.5 KB' },
  { name: 'GlitchCore.dll', size: '1.2 MB' },
  { name: 'SecretRecipe.txt', size: '420 Bytes' }
];

const Terminal = ({ currentTheme, onChangeTheme, onFryCommand, onGlitchSystem }) => {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Distorted Pixels(R) Command Interpreter [Version 1.0]' },
    { type: 'output', text: '(C) Copyright 1995-2026 Distorted Soft. All rights reserved.' },
    { type: 'output', text: 'Type "help" for a list of available commands.' },
    { type: 'output', text: '' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom of command history
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  // Focus input when terminal container is clicked
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const command = inputVal.trim();
      if (!command) return;

      const newHistory = [...history, { type: 'input', text: command }];
      const cmdParts = command.toLowerCase().split(' ');
      const baseCmd = cmdParts[0];
      const arg = cmdParts[1];

      let output = '';

      switch (baseCmd) {
        case 'help':
          output = `Available Commands:
  help            - Display this manual
  clear           - Clear the screen
  dir / ls        - List contents of local disk (C:)
  system          - Display current system environment variables
  theme [name]    - Switch theme (options: classic, weirdos, dark)
  fry             - Apply maximum deep-fry filters instantly
  joke            - Print a highly glitched programming joke
  glitch / rm -rf - Trigger a critical system crash (BSOD)`;
          break;

        case 'clear':
          setHistory([]);
          setInputVal('');
          return;

        case 'dir':
        case 'ls':
          output = ' Directory of C:\\\n\n' + FILES.map(f => `${f.name.padEnd(20)} ${f.size}`).join('\n') + `\n\n     ${FILES.length} File(s) loaded successfully`;
          break;

        case 'system':
          output = `Distorted OS Environment Variables:
  OS_VERSION  : v8.0.13
  ACTIVE_THEME: ${currentTheme.toUpperCase()}
  RESOLUTION  : ${window.innerWidth}x${window.innerHeight}
  CPU_SPEED   : 4.20 GHz (Fried)
  GLITCH_CORE : Active`;
          break;

        case 'theme':
          if (!arg) {
            output = 'Error: Theme name missing. Usage: theme [classic | weirdos | dark]';
          } else if (['classic', 'weirdos', 'dark'].includes(arg)) {
            onChangeTheme(arg);
            output = `Theme successfully updated to "${arg}".`;
          } else {
            output = `Error: Unknown theme "${arg}". Choose: classic, weirdos, dark`;
          }
          break;

        case 'fry':
          onFryCommand();
          output = 'SUCCESS: Maximum deep-frying filters activated. JPEG compression: MAXIMUM.';
          break;

        case 'joke':
          const idx = Math.floor(Math.random() * JOKES.length);
          output = JOKES[idx];
          break;

        case 'glitch':
        case 'rm':
          if (baseCmd === 'rm' && command !== 'rm -rf /') {
            output = 'Error: Missing arguments. Did you mean "rm -rf /" ?';
          } else {
            onGlitchSystem();
            output = 'FATAL ERROR: GLITCH SYSTEM CRITICAL STACK OVERFLOW. INITIALIZING MEMORY DUMP...';
          }
          break;

        default:
          output = `Command not recognized: "${baseCmd}". Type "help" for support.`;
      }

      setHistory([...newHistory, { type: 'output', text: output }]);
      setInputVal('');
    }
  };

  return (
    <div 
      className="terminal-window" 
      onClick={handleTerminalClick}
      style={{
        background: '#000000',
        color: '#39ff14',
        fontFamily: '"Courier New", Courier, monospace',
        padding: '15px',
        height: '350px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        border: '3px solid #333'
      }}
    >
      <div className="terminal-history" style={{ whiteSpace: 'pre-wrap', flex: 1 }}>
        {history.map((item, idx) => (
          <div key={idx} style={{ marginBottom: '6px', lineHeight: '1.4' }}>
            {item.type === 'input' ? (
              <span>C:\DISTORTED&gt; {item.text}</span>
            ) : (
              <span style={{ color: '#00ff66' }}>{item.text}</span>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
      
      <div className="terminal-input-line" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '8px' }}>C:\DISTORTED&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyPress}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#39ff14',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '1rem',
            padding: 0
          }}
        />
      </div>
    </div>
  );
};

export default Terminal;
