import { Link } from 'react-router-dom';
import { FaUsers, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import logo from '../../assets/logo.svg';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-header">
        <img src={logo} alt="Finance Control" className="logo" />
      </Link>
      <nav className="sidebar-nav">
        <Link to="/categorias" className="nav-link">
          <BiCategory /> Categorias
        </Link>
        <Link to="/pessoas" className="nav-link">
          <FaUsers /> Pessoas
        </Link>
        <Link to="/transacoes" className="nav-link">
          <FaMoneyBillWave /> Transações
        </Link>
        <Link to="/relatorios" className="nav-link">
          <FaChartLine /> Relatórios
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
