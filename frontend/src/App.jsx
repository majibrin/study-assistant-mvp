import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [screen, setScreen] = useState('landing'); 
  const [note, setNote] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleExplain = async () => {
    if (!note) return alert("Paste your notes first!");
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/explain/', { note });
      setResult(res.data);
      setScreen('explanation');
    } catch (e) { alert("AI error, try again!"); }
    setLoading(false);
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/saved/');
      setHistory(res.data);
      setScreen('history');
    } catch (e) { alert("Could not load library."); }
  };

  // FIX: This converts **bold** and * bullets into real HTML elements
  const formatContent = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      
      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('*')) {
        return <li key={i} style={{ textAlign: 'left', marginLeft: '20px', marginBottom: '10px' }}>{parts}</li>;
      }
      return <p key={i} style={{ textAlign: 'left', marginBottom: '15px', lineHeight: '1.6' }}>{parts}</p>;
    });
  };

  return (
    <div className="app-wrapper">
      <style>{`
        body, html, #root { margin: 0; padding: 0; width: 100%; min-height: 100vh; background: #f8f9fa; }
        .app-wrapper { display: flex; justify-content: center; width: 100%; min-height: 100vh; }
        .container { 
          width: 100%; max-width: 480px; background: white; min-height: 100vh; 
          padding: 40px 20px; box-sizing: border-box; text-align: center;
          box-shadow: 0 0 15px rgba(0,0,0,0.05);
        }
        .card { background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .btn { width: 100%; padding: 16px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; font-size: 1rem; }
        .btn-green { background: #27ae60; color: white; }
        .btn-gray { background: #95a5a6; color: white; margin-top: 12px; }
        .loader { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: white; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1000; }
        .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #27ae60; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      {loading && (
        <div className="loader">
          <div className="spinner"></div>
          <p style={{ marginTop: '15px', color: '#27ae60', fontWeight: 'bold' }}>Study Assistant is processing...</p>
        </div>
      )}

      <div className="container">
        <h1 style={{ color: '#27ae60', margin: '0 0 10px 0' }}>Study Assistant</h1>
        <p style={{ color: '#7f8c8d', marginBottom: '40px' }}>Instant clarity for university students.</p>

        {screen === 'landing' && (
          <div style={{ marginTop: '100px' }}>
            <button onClick={() => setScreen('input')} className="btn btn-green">Start Studying</button>
            <button onClick={fetchHistory} className="btn btn-gray">View Library</button>
          </div>
        )}

        {screen === 'input' && (
          <div>
            <textarea 
              style={{ width: '100%', height: '300px', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', marginBottom: '15px', fontSize: '1rem' }}
              placeholder="Paste notes here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button onClick={handleExplain} className="btn btn-green">Explain This</button>
            <button onClick={() => setScreen('landing')} style={{ background: 'none', border: 'none', color: '#3498db', marginTop: '20px' }}>Back</button>
          </div>
        )}

        {(screen === 'explanation' || screen === 'questions') && result && (
          <div>
            <div className="card">
              <h3 style={{ color: '#27ae60', marginBottom: '20px' }}>
                {screen === 'explanation' ? 'Explanation' : 'Practice Questions'}
              </h3>
              {screen === 'explanation' 
                ? formatContent(result.explanation) 
                : result.questions.map((q, i) => (
                    <div key={i} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                      <strong>Q{i+1}:</strong> {formatContent(q)}
                    </div>
                  ))
              }
            </div>
            <button 
              onClick={() => setScreen(screen === 'explanation' ? 'questions' : 'explanation')} 
              className="btn btn-green"
            >
              {screen === 'explanation' ? 'View Questions' : 'Back to Explanation'}
            </button>
            <button onClick={() => setScreen('landing')} style={{ background: 'none', border: 'none', color: '#3498db', marginTop: '20px', width: '100%' }}>Back Home</button>
          </div>
        )}

        {screen === 'history' && (
          <div>
            <h3>Library</h3>
            {history.map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee' }}>
                <span style={{ fontSize: '0.9rem' }}>{s.note.substring(0, 30)}...</span>
                <button onClick={() => { setResult(s); setScreen('explanation'); }} style={{ color: '#3498db', background: 'none', border: 'none', fontWeight: 'bold' }}>Open</button>
              </div>
            ))}
            <button onClick={() => setScreen('landing')} className="btn btn-gray">Back Home</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
