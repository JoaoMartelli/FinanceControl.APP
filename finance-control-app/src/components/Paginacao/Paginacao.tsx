import './Paginacao.css';

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  aoMudarPagina: (pagina: number) => void;
}

function Paginacao({ paginaAtual, totalPaginas, aoMudarPagina }: PaginacaoProps) {
  const gerarNumerosPaginas = () => {
    const paginas: (number | string)[] = [];
    const maxPaginasVisiveis = 5;

    if (totalPaginas <= maxPaginasVisiveis) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      if (paginaAtual <= 3) {
        for (let i = 1; i <= 4; i++) {
          paginas.push(i);
        }
        paginas.push('...');
        paginas.push(totalPaginas);
      } else if (paginaAtual >= totalPaginas - 2) {
        paginas.push(1);
        paginas.push('...');
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) {
          paginas.push(i);
        }
      } else {
        paginas.push(1);
        paginas.push('...');
        paginas.push(paginaAtual - 1);
        paginas.push(paginaAtual);
        paginas.push(paginaAtual + 1);
        paginas.push('...');
        paginas.push(totalPaginas);
      }
    }

    return paginas;
  };

  if (totalPaginas <= 1) return null;

  return (
    <div className="paginacao">
      <button
        className="btn-paginacao"
        onClick={() => aoMudarPagina(paginaAtual - 1)}
        disabled={paginaAtual === 1}
      >
        Anterior
      </button>

      {gerarNumerosPaginas().map((pagina, index) => (
        typeof pagina === 'number' ? (
          <button
            key={index}
            className={`btn-paginacao ${pagina === paginaAtual ? 'ativo' : ''}`}
            onClick={() => aoMudarPagina(pagina)}
          >
            {pagina}
          </button>
        ) : (
          <span key={index} className="paginacao-ellipsis">{pagina}</span>
        )
      ))}

      <button
        className="btn-paginacao"
        onClick={() => aoMudarPagina(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
      >
        Próxima
      </button>
    </div>
  );
}

export default Paginacao;
