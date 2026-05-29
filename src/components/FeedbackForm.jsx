import React, { useState, useEffect } from 'react';

const FeedbackForm = () => {
  const [activeTab, setActiveTab] = useState('suggest'); // 'suggest' or 'contact'
  
  // Suggest Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [fryLevel, setFryLevel] = useState('Deep Fried');
  
  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [subject, setSubject] = useState('Bug Report');
  const [message, setMessage] = useState('');

  // General Transmission States
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

  const handleTransmit = (type, data) => {
    setIsSending(true);
    setSendProgress(0);
    setSendStep('Dialing dial-up gateway...');

    const steps = [
      { progress: 20, text: 'Handshaking with Distorted Core...' },
      { progress: 50, text: 'Encrypting packet headers...' },
      { progress: 80, text: 'Bypassing firewall nodes...' },
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
          type, // 'Suggestion' or 'Contact Message'
          name: data.name,
          email: data.email,
          content: data.content,
          meta: data.meta, // fry level or message subject
          date: new Date().toLocaleString()
        };

        const updatedLogs = [newLog, ...feedbackLogs];
        setFeedbackLogs(updatedLogs);
        localStorage.setItem('distorted-feedback-logs', JSON.stringify(updatedLogs));
      }
    }, 800);
  };

  const handleSuggestSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !suggestion) {
      alert('Please fill out all fields before sending!');
      return;
    }
    handleTransmit('Suggestion', {
      name,
      email,
      content: suggestion,
      meta: fryLevel
    });
    setName('');
    setEmail('');
    setSuggestion('');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !message) {
      alert('Please fill out all fields before sending!');
      return;
    }
    handleTransmit('Contact Message', {
      name: contactName,
      email: contactEmail,
      content: message,
      meta: subject
    });
    setContactName('');
    setContactEmail('');
    setMessage('');
  };

  const handleReset = () => {
    setSubmitted(false);
  };

  return (
    <div className="feedback-container" style={{ padding: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* Tabs */}
      {!isSending && !submitted && (
        <div style={{ display: 'flex', borderBottom: '2px solid #000', gap: '4px' }}>
          <button 
            type="button" 
            onClick={() => setActiveTab('suggest')}
            style={{
              padding: '6px 15px',
              fontFamily: 'var(--title-font)',
              fontSize: '0.95rem',
              border: '2px solid #000',
              borderBottom: activeTab === 'suggest' ? '2px solid #f5f5f5' : '2px solid #000',
              background: activeTab === 'suggest' ? '#f5f5f5' : '#e0e0e0',
              marginBottom: '-2px',
              cursor: 'pointer',
              zIndex: 1
            }}
          >
            📬 Suggest Feature
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('contact')}
            style={{
              padding: '6px 15px',
              fontFamily: 'var(--title-font)',
              fontSize: '0.95rem',
              border: '2px solid #000',
              borderBottom: activeTab === 'contact' ? '2px solid #f5f5f5' : '2px solid #000',
              background: activeTab === 'contact' ? '#f5f5f5' : '#e0e0e0',
              marginBottom: '-2px',
              cursor: 'pointer',
              zIndex: 1
            }}
          >
            📧 Contact Us
          </button>
        </div>
      )}

      {isSending ? (
        <div style={{ padding: '20px', border: '2px solid #000', background: '#e0e0e0', textAlign: 'center' }}>
          <h3 style={{ textTransform: 'uppercase', marginBottom: '15px' }}>📡 Transmitting Packet...</h3>
          <p style={{ fontSize: '0.95rem', fontFamily: 'monospace', marginBottom: '15px' }}>{sendStep}</p>
          <div style={{ width: '100%', height: '24px', border: '3px solid #000', background: '#fff', position: 'relative' }}>
            <div style={{ height: '100%', background: 'var(--accent-purple)', width: `${sendProgress}%`, transition: 'width 0.3s ease-out' }} />
          </div>
          <span style={{ fontSize: '0.85rem', display: 'block', marginTop: '8px' }}>{sendProgress}%</span>
        </div>
      ) : submitted ? (
        <div style={{ padding: '20px', border: '2px solid #000', background: '#d4edda', color: '#155724', textAlign: 'center' }}>
          <h3 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>✅ Data Transmitted!</h3>
          <p style={{ fontSize: '0.95rem', marginBottom: '15px' }}>
            Your transmission has been successfully delivered and logged into our local registry!
          </p>
          <button className="btn" onClick={handleReset} style={{ background: '#28a745', color: '#fff', padding: '6px 15px' }}>
            ✍️ Open Form
          </button>
        </div>
      ) : activeTab === 'suggest' ? (
        /* Suggest Form */
        <form onSubmit={handleSuggestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f5f5f5', padding: '15px', border: '2px solid #000', borderTop: 'none' }}>
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
      ) : (
        /* Contact Form */
        <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f5f5f5', padding: '15px', border: '2px solid #000', borderTop: 'none' }}>
          <h4 style={{ margin: '0 0 5px 0', textTransform: 'uppercase', fontFamily: 'var(--title-font)' }}>📧 Contact the Developers</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Your Name:</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Alice SysOp" 
              value={contactName} 
              onChange={(e) => setContactName(e.target.value)}
              style={{ padding: '6px 8px', fontSize: '0.95rem', border: '2px solid #000' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Contact Email:</label>
            <input 
              type="email" 
              required
              placeholder="e.g. sysop@distortedcore.org" 
              value={contactEmail} 
              onChange={(e) => setContactEmail(e.target.value)}
              style={{ padding: '6px 8px', fontSize: '0.95rem', border: '2px solid #000' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Message Subject:</label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              style={{ padding: '6px', fontSize: '0.95rem', border: '2px solid #000', background: '#fff', cursor: 'pointer' }}
            >
              <option value="Bug Report">🐛 Bug Report / Glitch Alert</option>
              <option value="Feature Request">💡 Feature Request</option>
              <option value="Business Inquiry">💼 Business / Collab Inquiry</option>
              <option value="Hello World">👋 Just Saying Hello!</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Message Body:</label>
            <textarea 
              required
              rows="3"
              placeholder="Type your message details here..."
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              style={{ padding: '6px 8px', fontSize: '0.95rem', border: '2px solid #000', resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="btn" style={{ padding: '8px 12px', background: 'var(--accent-purple)', color: '#fff', marginTop: '5px' }}>
            🚀 Send Contact Message
          </button>
        </form>
      )}

      {/* Outbox logs */}
      <div style={{ background: '#fff', border: '2px dashed #999', padding: '10px' }}>
        <h5 style={{ margin: '0 0 8px 0', textTransform: 'uppercase', color: '#666' }}>📁 Transmission Outbox Logs ({feedbackLogs.length})</h5>
        {feedbackLogs.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic', margin: 0 }}>No transmission logs found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
            {feedbackLogs.map(log => (
              <div key={log.id} style={{ border: '1px solid #ccc', background: '#fcfcfc', padding: '6px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderBottom: '1px solid #eee', pb: '2px', mb: '4px' }}>
                  <span>
                    {log.type === 'Suggestion' ? '📬 Suggestion' : '📧 Contact'}: {log.name} 
                    <span style={{ fontWeight: 'normal', color: '#666', marginLeft: '5px' }}>({log.meta})</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#777' }}>{log.date}</span>
                </div>
                <p style={{ margin: 0, fontStyle: 'italic' }}>"{log.content}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
