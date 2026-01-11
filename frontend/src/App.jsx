import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LOGO_URL = "https://res.cloudinary.com/dys8am55x/image/upload/v1768131222/logo_rk0anr.png";
const LOADER_URL = "https://res.cloudinary.com/dys8am55x/image/upload/v1768131222/loader_riacbw.png";

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
    } catch (e) { alert("Could not load library"); }
  };

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**')) return <p key={i}><strong>{line.replaceAll('**', '')}</strong></p>;
      if (line.startsWith('*')) return <li key={i} style={{marginBottom: '5px'}}>{line.replace('*', '')}</li>;
      return <p key={i} style={{lineHeight: '1.6'}}>{line}</p>;
    });
  };

  // The Master Layout Wrapper
  const PageWrapper = ({ children, isCentered = false }) => (
    <div className="main-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: isCentered ? 'center' : 'flex-start',
      width: '100%',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        {children}
      </div>
    </div>
  );

  if (loading) return (
    <PageWrapper isCentered>
      <style>{`
        body, html, #root { 
          margin: 0; padding: 0; width: 100%; height: 100%; 
          display: flex; justify-content: center; align-items: center;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
      <img src={LOADER_URL} style={{ width: '80px', animation: 'spin 2s linear infinite' }} alt="Loading" />
      <p style={{ color: '#27ae60', fontWeight: 'bold', marginTop: '20px' }}>Thinkora is thinking...</p>
    </PageWrapper>
  );

  return (
    <PageWrapper isCentered={screen === 'landing'}>
      <style>{`
        body, html, #root { 
          margin: 0; padding: 0; width: 100%; display: flex; justify-content: center; 
        }
        p, li { text-align: left; }
      `}</style>

      {/* Branding Header - Visible on all screens except landing */}
      {screen !== 'landing' && <img src={LOGO_URL} style={{ width: '120px', marginBottom: '20px' }} alt="Thinkora" />}

      {screen === 'landing' && (
        <>
          <img src={LOGO_URL} style={{ width: '220px', marginBottom: '30px' }} alt="Logo" />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>Study smarter for your courses</h2>
          <p style={{ color: '#7f8c8d', marginBottom: '30px', textAlign: 'center' }}>Instant clarity for Nigerian university students.</p>
          <button onClick={() => setScreen('input')} style={btnStyle}>Start Studying</button>
          <button onClick={fetchHistory} style={{...btnStyle, background: '#95a5a6', marginTop: '15px'}}>View Library</button>
        </>
      )}

      {screen === 'input' && (
        <div style={{ width: '100%' }}>
          <h3 style={{marginBottom: '15px'}}>Paste your note or topic</h3>
          <textarea 
            style={textareaStyle}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="E.g. Law of Contract..."
          />
          <button onClick={handleExplain} style={btnStyle}>Explain This</button>
          <button onClick={() => setScreen('landing')} style={backBtn}>Back</button>
        </div>
      )}

      {screen === 'explanation' && result && (
        <div style={{ width: '100%' }}>
          <div style={cardStyle}>
            <h3 style={{textAlign: 'center', marginBottom: '15px'}}>Simplified Explanation</h3>
            {formatText(result.explanation)}
          </div>
          <button onClick={() => setScreen('questions')} style={btnStyle}>Generate Questions</button>
          <button onClick={() => setScreen('landing')} style={backBtn}>Back home</button>
        </div>
      )}

      {screen === 'questions' && result && (
        <div style={{ width: '100%' }}>
          <div style={cardStyle}>
            <h3 style={{textAlign: 'center', marginBottom: '15px'}}>Practice Questions</h3>
            {result.questions.map((q, i) => (
              <div key={i} style={questionBox}><strong>Q{i+1}:</strong> {q}</div>
            ))}
          </div>
          <button onClick={() => setScreen('explanation')} style={btnStyle}>Back to Explanation</button>
        </div>
      )}

      {screen === 'history' && (
        <div style={{ width: '100%' }}>
          <h3 style={{marginBottom: '20px'}}>Personal Study Library</h3>
          {history.length === 0 ? <p style={{textAlign:'center'}}>Empty library.</p> : history.map(s => (
            <div key={s.id} style={historyItemStyle}>
              <span style={{flex: 1, textAlign: 'left'}}>{s.note.substring(0, 30)}...</span>
              <button onClick={() => { setResult(s); setScreen('explanation'); }} style={smallBtn}>Open</button>
            </div>
          ))}
          <button onClick={() => setScreen('landing')} style={backBtn}>Back home</button>
        </div>
      )}
    </PageWrapper>
  );
}

const btnStyle = { width: '100%', padding: '16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' };
const textareaStyle = { width: '100%', height: '250px', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px', fontSize: '1rem', boxSizing: 'border-box' };
const cardStyle = { background: '#fdfdfd', padding: '20px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '20px', width: '100%', boxSizing: 'border-box' };
const backBtn = { background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', marginTop: '20px', width: '100%', textAlign: 'center' };
const historyItemStyle = { borderBottom: '1px solid #eee', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const smallBtn = { padding: '8px 15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px' };
const questionBox = { padding: '10px', background: '#f1f2f6', borderRadius: '5px', marginBottom: '10px', textAlign: 'left' };

export default App;
