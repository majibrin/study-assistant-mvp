import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [screen, setScreen] = useState('landing'); 
  const [note, setNote] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const LOGO_URL = "https://res.cloudinary.com/dys8am55x/image/upload/v1768131222/logo_rk0anr.png";
  const LOADER_URL = "https://res.cloudinary.com/dys8am55x/image/upload/v1768131222/loader_riacbw.png";

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
    const res = await axios.get('http://127.0.0.1:8000/api/saved/');
    setHistory(res.data);
    setScreen('history');
  };

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**')) return <p key={i}><strong>{line.replaceAll('**', '')}</strong></p>;
      if (line.startsWith('*')) return <li key={i} style={{marginBottom: '5px'}}>{line.replace('*', '')}</li>;
      return <p key={i} style={{lineHeight: '1.6'}}>{line}</p>;
    });
  };

  if (loading) {
    return (
      <div style={fullPageCenter}>
        <img src={LOADER_URL} style={loaderStyle} alt="Thinking" />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#27ae60', fontWeight: 'bold' }}>Thinkora is thinking...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      
      {screen === 'landing' && (
        <div style={fullPageCenter}>
          <img src={LOGO_URL} style={{ width: '220px', marginBottom: '30px' }} alt="Logo" />
          <h2 style={titleStyle}>Study smarter for your courses</h2>
          <p style={subTitleStyle}>Instant clarity for Nigerian university students.</p>
          <button onClick={() => setScreen('input')} style={btnStyle}>Start Studying</button>
          <button onClick={fetchHistory} style={{...btnStyle, background: '#95a5a6', marginTop: '15px'}}>View Library</button>
        </div>
      )}

      {screen === 'input' && (
        <div style={contentWrapper}>
          <div style={{ textAlign: 'center' }}><img src={LOGO_URL} style={{ width: '120px', marginBottom: '20px' }} alt="Thinkora" /></div>
          <h3 style={sectionTitle}>Paste your note or topic</h3>
          <textarea 
            style={textareaStyle}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="E.g. Nigerian Legal System..."
          />
          <button onClick={handleExplain} style={btnStyle}>Explain This</button>
          <button onClick={() => setScreen('landing')} style={backBtn}>Back</button>
        </div>
      )}

      {screen === 'explanation' && result && (
        <div style={contentWrapper}>
          <div style={{ textAlign: 'center' }}><img src={LOGO_URL} style={{ width: '100px', marginBottom: '10px' }} alt="Thinkora" /></div>
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Simplified Explanation</h3>
            {formatText(result.explanation)}
          </div>
          <div style={buttonGroup}>
            <button onClick={() => setScreen('questions')} style={btnStyle}>Generate Questions</button>
            <button onClick={() => setScreen('landing')} style={{...btnStyle, background: '#34495e'}}>Save & Close</button>
          </div>
        </div>
      )}

      {screen === 'questions' && result && (
        <div style={contentWrapper}>
          <div style={{ textAlign: 'center' }}><img src={LOGO_URL} style={{ width: '100px', marginBottom: '10px' }} alt="Thinkora" /></div>
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Practice Exam Questions</h3>
            {result.questions.map((q, i) => (
              <div key={i} style={questionBox}>
                <strong>Q{i+1}:</strong> {q}
              </div>
            ))}
          </div>
          <button onClick={() => setScreen('explanation')} style={btnStyle}>Back to Explanation</button>
        </div>
      )}

      {screen === 'history' && (
        <div style={contentWrapper}>
          <div style={{ textAlign: 'center' }}><img src={LOGO_URL} style={{ width: '120px', marginBottom: '20px' }} alt="Thinkora" /></div>
          <h3 style={sectionTitle}>Personal Study Library</h3>
          {history.length === 0 ? <p style={{textAlign:'center'}}>Your library is empty.</p> : history.map(s => (
            <div key={s.id} style={historyItemStyle}>
              <span style={{flex: 1, marginRight: '10px'}}>{s.note.substring(0, 40)}...</span>
              <button onClick={() => { setResult(s); setScreen('explanation'); }} style={smallBtn}>Open</button>
            </div>
          ))}
          <button onClick={() => setScreen('landing')} style={backBtn}>Back home</button>
        </div>
      )}
    </div>
  );
}

// STYLES OBJECT
const containerStyle = { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff', padding: '0 20px' };
const fullPageCenter = { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', textAlign: 'center', width: '100%' };
const contentWrapper = { width: '100%', maxWidth: '500px', paddingTop: '40px', paddingBottom: '40px' };
const titleStyle = { fontSize: '1.6rem', fontWeight: 'bold', margin: '10px 0' };
const subTitleStyle = { color: '#7f8c8d', marginBottom: '30px' };
const sectionTitle = { fontSize: '1.3rem', marginBottom: '15px', textAlign: 'center' };
const btnStyle = { width: '100%', padding: '16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' };
const textareaStyle = { width: '100%', height: '250px', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px', fontSize: '1rem', boxSizing: 'border-box' };
const cardStyle = { background: '#fdfdfd', padding: '20px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '20px', width: '100%', boxSizing: 'border-box' };
const buttonGroup = { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' };
const backBtn = { background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', marginTop: '20px', width: '100%', textAlign: 'center', fontSize: '1rem' };
const historyItemStyle = { borderBottom: '1px solid #eee', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' };
const smallBtn = { padding: '8px 15px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px' };
const loaderStyle = { width: '80px', marginBottom: '20px', animation: 'spin 2s linear infinite' };
const questionBox = { padding: '10px', background: '#f1f2f6', borderRadius: '5px', marginBottom: '10px' };

export default App;
