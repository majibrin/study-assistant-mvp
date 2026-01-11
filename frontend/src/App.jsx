import React, { useState } from 'react';
import axios from 'axios';

function App() {
  // Screens: 'landing', 'input', 'explanation', 'questions', 'history'
  const [screen, setScreen] = useState('landing'); 
  const [note, setNote] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Feature 1: Note -> Simple Explanation
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

  // Feature 2: Practice Question Generator
  const goToQuestions = () => setScreen('questions');

  // Feature 3: Save & Revisit
  const fetchHistory = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/saved/');
    setHistory(res.data);
    setScreen('history');
  };

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**')) return <p key={i}><strong>{line.replaceAll('**', '')}</strong></p>;
      if (line.startsWith('*')) return <li key={i}>{line.replace('*', '')}</li>;
      return <p key={i}>{line}</p>;
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'sans-serif', color: '#2c3e50' }}>
      <h1 style={{ textAlign: 'center' }}>Thinkora 🧠</h1>

      {/* 1. Landing Page */}
      {screen === 'landing' && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Study smarter for your courses</h2>
          <p>Instant clarity for Nigerian university students.</p>
          <button onClick={() => setScreen('input')} style={btnStyle}>Start Studying</button>
          <button onClick={fetchHistory} style={{...btnStyle, background: '#95a5a6', marginTop: '10px'}}>View Library</button>
        </div>
      )}

      {/* 2. Input Page */}
      {screen === 'input' && (
        <div>
          <h3>Paste your note or topic</h3>
          <textarea 
            style={textareaStyle}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="E.g. The functions of the nervous system..."
          />
          <button onClick={handleExplain} disabled={loading} style={btnStyle}>
            {loading ? "Processing..." : "Explain This"}
          </button>
          <button onClick={() => setScreen('landing')} style={backBtn}>Back</button>
        </div>
      )}

      {/* 3. Explanation Page */}
      {screen === 'explanation' && result && (
        <div style={cardStyle}>
          <h3>Simplified Explanation</h3>
          {formatText(result.explanation)}
          <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
            <button onClick={goToQuestions} style={btnStyle}>Generate Questions</button>
            <button onClick={() => setScreen('landing')} style={{...btnStyle, background: '#34495e'}}>Save & Close</button>
          </div>
        </div>
      )}

      {/* 4. Questions Page */}
      {screen === 'questions' && result && (
        <div style={cardStyle}>
          <h3>Practice Exam Questions</h3>
          {result.questions.map((q, i) => (
            <div key={i} style={{marginBottom: '15px'}}>
              <strong>Q{i+1}:</strong> {q}
            </div>
          ))}
          <button onClick={() => setScreen('explanation')} style={btnStyle}>Back to Explanation</button>
        </div>
      )}

      {/* 5. Saved Studies Page */}
      {screen === 'history' && (
        <div>
          <h3>Personal Study Library</h3>
          {history.length === 0 ? <p>Your library is empty.</p> : history.map(s => (
            <div key={s.id} style={historyItemStyle}>
              <p><strong>{s.note.substring(0, 40)}...</strong></p>
              <button onClick={() => { setResult(s); setScreen('explanation'); }} style={smallBtn}>Open</button>
            </div>
          ))}
          <button onClick={() => setScreen('landing')} style={backBtn}>Back home</button>
        </div>
      )}
    </div>
  );
}

// Minimal CSS-in-JS for MVP
const btnStyle = { width: '100%', padding: '15px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const textareaStyle = { width: '100%', height: '200px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' };
const cardStyle = { background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' };
const backBtn = { background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', marginTop: '20px', display: 'block', width: '100%' };
const historyItemStyle = { borderBottom: '1px solid #eee', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const smallBtn = { padding: '5px 10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '3px' };

export default App;
