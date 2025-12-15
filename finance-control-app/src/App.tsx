import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Categorias from './pages/Categorias/Categorias';
import Pessoas from './pages/Pessoas/Pessoas';
import Transacoes from './pages/Transacoes/Transacoes';
import Relatorios from './pages/Relatorios/Relatorios';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="pessoas" element={<Pessoas />} />
          <Route path="transacoes" element={<Transacoes />} />
          <Route path="relatorios" element={<Relatorios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
