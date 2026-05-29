import React, { useState, useEffect } from 'react';

const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [fryLevel, setFryLevel] = useState('Deep Fried');
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendStep, setSendStep] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedbackLogs, setFeedbackLogs] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('distorted-feedback-logs');
    if (saved) {
      setFeedbackLogs(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !suggestion) {
      alert('Please fill out all fields before sending!');
      return;
    }

    setIsSending(true);
    setSendProgress(0);
    setSendStep('Dialing suggestion server...');

    const steps = [
      { progress: 20, text: 'Handshaking with Distorted Core...' },
      { progress: 50, text: 'Compressing suggestions to 0.125 JPG...' },
      { progress: 80, text: 'Bypassing firewall filters...' },
      { progress: 100, text: 'Transmission completed successfully.' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSendProgress(steps[currentStep].progress);
        setSendStep(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsSending(false);
        setSubmitted(true);

        const newLog = {
          id: Date.now(),
          name,
          email,
          suggestion,
          fryLevel,
          date: new Date().toLocaleString()
        };

        const updatedLogs = [newLog, ...feedbackLogs];
        setFeedbackLogs(updatedLogs);
        localStorage.setItem('distorted-feedback-logs', JSON.stringify(updatedLogs));

        // Reset fields
        setName('');
        setEmail('');
        setSuggestion('');
      }
    }, 900);
  };

  const handleReset = () => {
    setSubmitted(false);
  };

  return (
    <div className="feedback-container" style={{ padding: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {isSending ? (
        <div style={{ padding: '20px', border: '2px solid #000', background: '#e0e0e0', textAlign: 'center' }}>
          <h3 style={{ textTransform: 'uppercase', marginBottom: '15px' }}>📡 Transmitting Suggestion...</h3>
          <p style={{ fontSize: '0.95rem', fontFamily: 'monospace', marginBottom: '15px' }}>{sendStep}</p>
          <div style={{ width: '100%', height: '24px', border: '3px solid #000', background: '#fff', position: 'relative' }}>
            <div style={{ height: '100%', background: 'var(--accent-purple)', width: `${sendProgress}%`, transition: 'width 0.3s ease-out' }} />
          </div>
          <span style={{ fontSize: '0.85rem', display: 'block', marginTop: '8px' }}>{sendProgress}%</span>
        </div>
      ) : submitted ? (
        <div style={{ padding: '20px', border: '2px solid #000', background: '#d4edda', color: '#155724', textAlign: 'center' }}>
          <h3 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>✅ Suggestion Logged!</h3>
          <p style={{ fontSize: '0.95rem', marginBottom: '15px' }}>
            Your feedback has been successfully deep-fried and logged into our local registry!
          </p>
          <button className="btn" onClick={handleReset} style={{ background: '#28a745', color: '#fff', padding: '6px 15px' }}>
            📝 Submit Another suggestion
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f5f5f5', padding: '15px', border: '2px solid #000' }}>
          <h4 style={{ margin: '0 0 5px 0', textTransform: 'uppercase', fontFamily: 'var(--title-font)' }}>📬 Send Feature Suggestion</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Your Name:</label>
            <input 
              type="text" 
              required
              placeholder="e.g. John Retro" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              style={{ padding: '6px 8px', fontSize: '0.95rem', border: '2px solid #000' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Contact Email:</label>
            <input 
              type="email" 
              required
              placeholder="e.g. pentium95@dialup.net" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '6px 8px', fontSize: '0.95rem', border: '2px solid #000' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Feature / Suggestion Idea:</label>
            <textarea 
              required
              rows="3"
              placeholder="Suggest new filters, themes, games, or features you want added..."
              value={suggestion} 
              onChange={(e) => setSuggestion(e.target.value)}
              style={{ padding: '6px 8px', fontSize: '0.95rem', border: '2px solid #000', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Fry Level of Suggestion:</label>
            <select 
              value={fryLevel} 
              onChange={(e) => setFryLevel(e.target.value)}
              style={{ padding: '6px', fontSize: '0.95rem', border: '2px solid #000', background: '#fff', cursor: 'pointer' }}
            >
              <option value="Crispy">Crispy (Lightly Salted)</option>
              <option value="Deep Fried">Deep Fried (Double Batter)</option>
              <option value="Nuclear">Nuclear (Extra Spices)</option>
              <option value="Burnt">Burnt (Accidentally Left in Fryer)</option>
            </select>
          </div>

          <button type="submit" className="btn" style={{ padding: '8px 12px', background: 'var(--accent-orange)', color: '#fff', marginTop: '5px' }}>
            🚀 Transmit Suggestion
          </button>
        </form>
      )}

      {/* Suggestion History logs */}
      <div style={{ background: '#fff', border: '2px dashed #999', padding: '10px' }}>
        <h5 style={{ margin: '0 0 8px 0', textTransform: 'uppercase', color: '#666' }}>📁 Transmission Outbox Logs ({feedbackLogs.length})</h5>
        {feedbackLogs.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic', margin: 0 }}>No previously logged suggestions.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
            {feedbackLogs.map(log => (
              <div key={log.id} style={{ border: '1px solid #ccc', background: '#fcfcfc', padding: '6px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderBottom: '1px solid #eee', pb: '2px', mb: '4px' }}>
                  <span>{log.name} [{log.fryLevel}]</span>
                  <span style={{ fontSize: '0.75rem', color: '#777' }}>{log.date}</span>
                </div>
                <p style={{ margin: 0, fontStyle: 'italic' }}>"{log.suggestion}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
