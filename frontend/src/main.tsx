import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import './i18n';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)
