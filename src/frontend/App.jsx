import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import HomePage from './pages/HomePage';
import FormPage from './pages/FormPage';
import Footer from './components/Footer';
import './styles/index.css';

export default function App() {
  return (
    <Router>
      <div data-theme="light">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/formulaire-qualification" element={
            <>
              <Hero />
              <FormPage />
            </>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
