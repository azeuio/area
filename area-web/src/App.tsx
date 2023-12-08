import React from 'react';
import './App.css';

import CTA from './Components/CTA';

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <CTA buttonText="Get started" buttonStyle="bg-[#34A853] text-[#FFFFF]" onClick={() => {alert("message")}} />
      </div>
    </div>
  );
}

export default App;
