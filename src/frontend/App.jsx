import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import QualificationPage from './pages/QualificationPage';
import Footer from './components/Footer';
import './styles/index.css';

export default function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/formulaire-qualification" element={<QualificationPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
