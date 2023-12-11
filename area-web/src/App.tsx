import React, { useState } from 'react';
import './App.css';

import CTA from './Components/CTA';
import TextInput from './Components/TextInput';

function App() {
  const [message, setMessage] = useState("Nothing");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }
  return (
    <div className="App">
      <div className="App-header">
        <div>
          <TextInput placeholder="username" textInputStyle="bg-[#00000] border-[#D9D9D9] text-[#8E8E93] focus:border-[#34A853]" />
        </div>
        <div className='p-4'>
          <TextInput isPassword={true} placeholder="password" textInputStyle="bg-[#00000] border-[#D9D9D9] text-[#8E8E93] focus:border-[#34A853]" onChange={handleChange} />
        </div>
        <div>
          <CTA buttonText="Get started" buttonStyle="bg-[#34A853] text-[#FFFFF]" onClick={() => {alert("Password is: " + message)}} />
        </div>
      </div>
    </div>
  );
}

export default App;
