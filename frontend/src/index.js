import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { VocabsContextProvider } from './context/vocabsContext';
import { AuthContextProvider} from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom';
import { LeaderboardContextProvider } from './context/LeaderboardContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <VocabsContextProvider>
      <AuthContextProvider>
        <LeaderboardContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LeaderboardContextProvider>      
      </AuthContextProvider>
  </VocabsContextProvider>
);



