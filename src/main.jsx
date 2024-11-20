import { createRoot } from 'react-dom/client';
import './index.css';
import Master from './components/Master';
import { BrowserRouter } from 'react-router-dom';
import './App.css'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Master></Master>
  </BrowserRouter>
);
