import React from 'react';

const Layout = ({ children, centered = false }) => (
  <div style={{
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: centered ? 'center' : 'flex-start',
    minHeight: '100vh', 
    width: '100%', 
    padding: '20px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    fontFamily: 'sans-serif'
  }}>
    <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {children}
    </div>
  </div>
);

export default Layout;
