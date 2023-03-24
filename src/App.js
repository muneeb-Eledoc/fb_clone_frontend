import './App.scss';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from './components/Signup';
import Messenger from './components/messenger/Messenger';
import Wrapper from './components/minimessenger/Wrapper';
import { useEffect } from 'react';

function App() {

  const RequiredRoute = ({ children }) => {
    return localStorage.getItem("token") ? children : <Navigate to='/login' />
  }

  return (
    <div>
      <BrowserRouter>
        <Wrapper />
        <Routes>
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:username" element={<RequiredRoute> <Profile /></RequiredRoute>} />
          <Route path="/" element={<RequiredRoute> <Home /></RequiredRoute>} />
          <Route path="/messenger" element={<RequiredRoute> <Messenger /> </RequiredRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
