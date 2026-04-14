import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { LeadForm } from '../components/LeadForm';
export function App(){return <><Header /><section className="hero"><div className="container"><h1 style={{fontSize:'2.5rem',marginBottom:16}}>Automatisez vos process et structurez votre croissance</h1><p style={{fontSize:'1.2rem',opacity:.9}}>SynapFlows conçoit des systèmes d'automatisation, de collecte et de pilotage métier connectés à vos outils.</p></div></section><main className="container"><LeadForm /></main><Footer /></>}
