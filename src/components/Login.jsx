import React, { useState, useEffect } from 'react';

const Login = ({ onLogin, onShutdown, isWindowed = false }) => {
  const [bootPhase, setBootPhase] = useState(isWindowed ? 'login' : 'booting'); // 'booting' | 'login'
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState([]);
  
  // Load accounts database
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem('distorted-pixels-users');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    const initial = {
      'Admin': 'pixels',
      'GlitchWizard': 'distort'
    };
    localStorage.setItem('distorted-pixels-users', JSON.stringify(initial));
    return initial;
  });

  // Mode and form states
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('');
  
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [isShaking, setIsShaking] = useState(false);

  const biosLogs = [
    'DISTORTED PIXELS(R) BIOS V4.0.95',
    'COPYRIGHT (C) 1995-2026 GLITCH CORE CORP.',
    '----------------------------------------',
    'CPU: Intel Pentium(R) @ 133 MHz',
    'Memory Test: 16384 KB OK',
    'Detecting IDE Primary Master ... PIXEL_HD_1.2GB',
    'Detecting IDE Secondary Master ... SOUND_BLASTER_16',
    'Loading BOOT_SECTOR ... OK',
    'Initializing CRITICAL_DRIVERS.SYS ... OK',
    'Loading VGA_DISPLAY_DRIVER.DLL ... OK',
    'Starting Distorted Pixels OS ...'
  ];

  // Play retro motherboard beep sound
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // Motherboard POST beep frequency
      
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.16);
    } catch (e) {
      console.warn("Motherboard beep blocked by browser autoplay policy.");
    }
  };

  // Boot sequence animation
  useEffect(() => {
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < biosLogs.length) {
        setBootLogs(prev => [...prev, biosLogs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 180);

    const progressInterval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setBootPhase('login');
          }, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Try playing beep immediately on mount (or first interaction)
    playBeep();

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (username === 'Guest') {
      onLogin(username);
      return;
    }

    const expectedPassword = users[username];
    if (expectedPassword) {
      if (password === expectedPassword) {
        onLogin(username);
      } else {
        triggerError(`Invalid password for ${username}. Hint: Check the password or password hints.`);
      }
    } else {
      triggerError(`User '${username}' does not exist.`);
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const trimmedUser = signUpUsername.trim();
    if (!trimmedUser) {
      triggerError("Username cannot be empty.");
      return;
    }

    if (trimmedUser.toLowerCase() === 'guest') {
      triggerError("'Guest' is a reserved username.");
      return;
    }

    if (users[trimmedUser]) {
      triggerError(`The username '${trimmedUser}' is already registered.`);
      return;
    }

    if (signUpPassword.length < 3) {
      triggerError("Password must be at least 3 characters long.");
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      triggerError("Passwords do not match.");
      return;
    }

    // Save user to state & localStorage
    const updatedUsers = {
      ...users,
      [trimmedUser]: signUpPassword
    };
    setUsers(updatedUsers);
    localStorage.setItem('distorted-pixels-users', JSON.stringify(updatedUsers));

    // Log user in automatically
    alert(`Account created successfully! Welcome, ${trimmedUser}!`);
    onLogin(trimmedUser);
  };

  const triggerError = (msg) => {
    setError(msg);
    setIsShaking(true);
    // Play error beep
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}

    setTimeout(() => {
      setIsShaking(false);
    }, 300);
  };

  if (bootPhase === 'booting') {
    return (
      <div className="boot-screen" onClick={playBeep}>
        <div>
          <div className="boot-header">
            <div className="boot-logo">✦ DISTORTED PIXELS V4.0.95 ✦</div>
            <div>BIOS Revision 1.04.95a</div>
          </div>
          <div className="boot-specs">
            Processor: Intel Pentium(R) @ 133 MHz
            <br />
            Memory Size: 16384 KB System RAM
            <br />
            Graphics: Standard VGA Accelerator Card
            <br />
            Audio: Sound Blaster 16 (Compatible)
          </div>
          <div className="boot-log">
            {bootLogs.map((log, index) => (
              <div key={index} className="boot-log-line">
                {log}
              </div>
            ))}
          </div>
        </div>
        <div className="boot-footer">
          <div>Press DEL to enter Setup, ESC for Boot Menu</div>
          <div className="boot-progress-container">
            <div className="boot-progress-bar" style={{ width: `${bootProgress}%` }} />
          </div>
        </div>
      </div>
    );
  }

  const tabs = (
    <div style={{ display: 'flex', borderBottom: '2px solid #000', marginBottom: '15px' }}>
      <button 
        type="button"
        style={{
          padding: '6px 12px',
          fontFamily: 'inherit',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          background: mode === 'signin' ? 'var(--win-bg)' : '#e0e0e0',
          border: '2px solid #000',
          borderBottom: mode === 'signin' ? '2px solid var(--win-bg)' : '2px solid #000',
          marginBottom: mode === 'signin' ? '-2px' : '0',
          zIndex: mode === 'signin' ? 2 : 1,
          marginRight: '4px'
        }}
        onClick={() => { setMode('signin'); setError(null); }}
      >
        🔑 Sign In
      </button>
      <button 
        type="button"
        style={{
          padding: '6px 12px',
          fontFamily: 'inherit',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          background: mode === 'signup' ? 'var(--win-bg)' : '#e0e0e0',
          border: '2px solid #000',
          borderBottom: mode === 'signup' ? '2px solid var(--win-bg)' : '2px solid #000',
          marginBottom: mode === 'signup' ? '-2px' : '0',
          zIndex: mode === 'signup' ? 2 : 1
        }}
        onClick={() => { setMode('signup'); setError(null); }}
      >
        📝 Sign Up
      </button>
    </div>
  );

  const formContent = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {tabs}
      
      {mode === 'signin' ? (
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <div className="login-banner">
            <span className="login-banner-icon">🔐</span>
            <div className="login-banner-text">
              <h2>Welcome Back</h2>
              <p>Select your user name and enter your password to connect to the network.</p>
            </div>
          </div>
          
          <div className="login-fields">
            <div className="login-field-row">
              <label htmlFor="login-username">User name:</label>
              <select
                id="login-username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setPassword('');
                  setError(null);
                }}
                style={{ fontFamily: 'monospace' }}
              >
                {Object.keys(users).map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
                <option value="Guest">Guest</option>
              </select>
            </div>
            
            {username !== 'Guest' && (
              <div className="login-field-row">
                <label htmlFor="login-password">Password:</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  autoFocus
                />
              </div>
            )}
          </div>

          {error && (
            <div style={{
              color: 'red',
              fontSize: '0.9rem',
              border: '2px solid red',
              padding: '6px 10px',
              background: '#fff',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              ⚠️ ERROR: {error}
            </div>
          )}

          <div style={{
            fontSize: '0.85rem',
            color: '#555',
            fontStyle: 'italic',
            background: '#f9f9f9',
            padding: '6px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}>
            {username === 'Admin' && "💡 Hint: The admin password is 'pixels'."}
            {username === 'GlitchWizard' && "💡 Hint: The wizard password is 'distort'."}
            {username !== 'Admin' && username !== 'GlitchWizard' && username !== 'Guest' && `💡 Hint: Password for ${username} was set during Sign Up.`}
            {username === 'Guest' && "💡 Hint: No password is required for Guest login!"}
          </div>

          <div className="login-buttons">
            <button type="submit" className="btn">
              OK
            </button>
            <button 
              type="button" 
              className="btn" 
              style={{ background: 'var(--accent-pink)', color: '#000' }}
              onClick={() => {
                setUsername('Guest');
                onLogin('Guest');
              }}
            >
              Guest Login
            </button>
            <button 
              type="button" 
              className="btn"
              style={{ background: 'var(--accent-orange)' }}
              onClick={onShutdown}
            >
              Shut Down...
            </button>
          </div>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleSignUpSubmit}>
          <div className="login-banner">
            <span className="login-banner-icon">📝</span>
            <div className="login-banner-text">
              <h2>Create Account</h2>
              <p>Register a new user account on this local terminal.</p>
            </div>
          </div>
          
          <div className="login-fields">
            <div className="login-field-row">
              <label htmlFor="signup-username">User name:</label>
              <input
                id="signup-username"
                type="text"
                value={signUpUsername}
                onChange={(e) => setSignUpUsername(e.target.value)}
                placeholder="Choose username..."
                autoFocus
              />
            </div>
            
            <div className="login-field-row">
              <label htmlFor="signup-password">Password:</label>
              <input
                id="signup-password"
                type="password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="Min 3 characters..."
              />
            </div>

            <div className="login-field-row">
              <label htmlFor="signup-confirm">Confirm:</label>
              <input
                id="signup-confirm"
                type="password"
                value={signUpConfirmPassword}
                onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                placeholder="Confirm password..."
              />
            </div>
          </div>

          {error && (
            <div style={{
              color: 'red',
              fontSize: '0.9rem',
              border: '2px solid red',
              padding: '6px 10px',
              background: '#fff',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              ⚠️ ERROR: {error}
            </div>
          )}

          <div className="login-buttons">
            <button type="submit" className="btn" style={{ background: 'var(--accent-green)', color: '#000' }}>
              Sign Up
            </button>
            <button 
              type="button" 
              className="btn" 
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );

  if (isWindowed) {
    return (
      <div className={isShaking ? 'shake' : ''} style={{ padding: '5px' }}>
        {formContent}
      </div>
    );
  }

  return (
    <div className="login-overlay">
      <div className={`window login-dialog-window ${isShaking ? 'shake' : ''}`}>
        <div className="window-title-bar">
          <span>Enter Network Password</span>
          <div className="window-title-buttons">
            <button className="window-btn" onClick={onShutdown} title="Shutdown">X</button>
          </div>
        </div>
        <div className="window-content">
          {formContent}
        </div>
      </div>
    </div>
  );
};

export default Login;
