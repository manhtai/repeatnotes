import React from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/comic-mono';
import {BrowserRouter} from 'react-router-dom';

import {AuthProvider} from 'src/components/auth/AuthProvider';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './css/main.css';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
