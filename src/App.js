import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Gallery from './pages/gallery';
import Contact from './pages/contact';
import Navbar from './navbar';

function App() {
  return (
    <div className="App">
    <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
