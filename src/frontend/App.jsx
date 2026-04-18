import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FormPage from './pages/FormPage';
import Footer from './components/Footer';
import './styles/index.css';

export default function App() {
  return (
    <div data-theme="light">
      <Header />
      <Hero />
      <FormPage />
      <Footer />
    </div>
  );
}
