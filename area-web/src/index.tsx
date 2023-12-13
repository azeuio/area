import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

import Playground from './pages/Playground';

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="playground" element={<Playground />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
