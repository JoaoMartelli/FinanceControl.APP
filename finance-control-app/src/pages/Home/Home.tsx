import { useEffect } from 'react';
import './Home.css';

function Home() {
  useEffect(() => {
    document.title = 'Finance Control - Início';
  }, []);

  return (
    <div className="home-container">
      <h1>Bem-vindo ao Finance Control</h1>
      <p>Gerencie suas finanças de forma simples e eficiente</p>
      <div className="cards-container">
        <div className="card">
          <h3>Categorias</h3>
          <p>Organize suas transações por categorias</p>
        </div>
        <div className="card">
          <h3>Pessoas</h3>
          <p>Gerencie as pessoas envolvidas nas transações</p>
        </div>
        <div className="card">
          <h3>Transações</h3>
          <p>Registre e acompanhe todas as movimentações</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
