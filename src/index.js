import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/authContext/AuthContext';
import { PostContextProvider } from './context/postContext/PostContext';
import { StatusContextProvider } from './context/statusContext/StatusContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <PostContextProvider>
        <StatusContextProvider>
          <App />
        </StatusContextProvider>
      </PostContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);