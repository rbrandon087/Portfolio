import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Gallery from './pages/gallery';
import Contact from './pages/contact'
import './App.css';

function App() {
  return (
    <div className="App">
  <Router>
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path="/gallery" element={<Gallery />}/>
      <Route path="/contact" element={<Contact />}/>
    </Routes>
  </Router>
    </div>
  );
}

export default App;
