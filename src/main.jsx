// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ButtonAppBar from './pages/App';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Play from './pages/Play';
import Easygame from './pages/Easygame';
import HistoryPage from './pages/HistoryPage';
import GameDetailPage from './pages/GameDetailPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/digits">
      <Routes>
        <Route path="/" element={<ButtonAppBar />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/Play" element={<Play/>}/>
        <Route path="/Easygame" element={<Easygame/>}/>
        <Route path="/history/:nickname" element={<HistoryPage />} />
        <Route path="/gamedetail/:id" element={<GameDetailPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
