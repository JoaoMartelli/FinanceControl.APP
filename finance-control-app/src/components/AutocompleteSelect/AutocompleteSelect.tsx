import { useState, useEffect, useRef } from 'react';
import './AutocompleteSelect.css';

interface Opcao {
  valor: number;
  rotulo: string;
}

interface AutocompleteSelectProps {
  opcoes: Opcao[];
  valorSelecionado: number;
  aoSelecionar: (valor: number) => void;
  placeholder?: string;
  rotulo?: string;
}

function AutocompleteSelect({ 
  opcoes, 
  valorSelecionado, 
  aoSelecionar, 
  placeholder = 'Digite para filtrar...',
  rotulo 
}: AutocompleteSelectProps) {
  const [busca, setBusca] = useState('');
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  const [opcoesFiltradas, setOpcoesFiltradas] = useState<Opcao[]>(opcoes);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opcaoSelecionada = opcoes.find(op => op.valor === valorSelecionado);
    if (opcaoSelecionada && !mostrarOpcoes) {
      setBusca(opcaoSelecionada.rotulo);
    }
  }, [valorSelecionado, opcoes, mostrarOpcoes]);

  useEffect(() => {
    if (busca === '') {
      setOpcoesFiltradas(opcoes);
    } else {
      const filtradas = opcoes.filter(op => 
        op.rotulo.toLowerCase().includes(busca.toLowerCase())
      );
      setOpcoesFiltradas(filtradas);
    }
  }, [busca, opcoes]);

  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMostrarOpcoes(false);
        const opcaoSelecionada = opcoes.find(op => op.valor === valorSelecionado);
        if (opcaoSelecionada) {
          setBusca(opcaoSelecionada.rotulo);
        }
      }
    };

    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, [valorSelecionado, opcoes]);

  const handleFocus = () => {
    setMostrarOpcoes(true);
    setBusca('');
  };

  const handleSelecionar = (opcao: Opcao) => {
    aoSelecionar(opcao.valor);
    setBusca(opcao.rotulo);
    setMostrarOpcoes(false);
  };

  return (
    <div className="autocomplete-container" ref={containerRef}>
      {rotulo && <label className="autocomplete-label">{rotulo}</label>}
      <input
        type="text"
        className="form-control autocomplete-input"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        onFocus={handleFocus}
        placeholder={placeholder}
      />
      {mostrarOpcoes && (
        <div className="autocomplete-opcoes">
          {opcoesFiltradas.length > 0 ? (
            opcoesFiltradas.map((opcao) => (
              <div
                key={opcao.valor}
                className={`autocomplete-opcao ${opcao.valor === valorSelecionado ? 'selecionado' : ''}`}
                onClick={() => handleSelecionar(opcao)}
              >
                {opcao.rotulo}
              </div>
            ))
          ) : (
            <div className="autocomplete-opcao sem-resultado">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AutocompleteSelect;
