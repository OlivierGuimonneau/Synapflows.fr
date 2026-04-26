import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import QualificationPage from './pages/QualificationPage';
import LegalPage from './pages/LegalPage';
import TermsPage from './pages/TermsPage';
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
          <Route path="/mentions-legales" element={<LegalPage />} />
          <Route path="/conditions-generales" element={<TermsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
