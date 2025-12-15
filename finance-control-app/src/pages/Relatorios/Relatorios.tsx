import { useState, useEffect } from 'react';
import { transacaoService } from '../../services/transacaoService';
import { pessoaService } from '../../services/pessoaService';
import { categoriaService } from '../../services/categoriaService';
import type { TotalGeralResponse } from '../../types/models';
import Paginacao from '../../components/Paginacao/Paginacao';
import './Relatorios.css';

type TipoVisualizacao = 'pessoas' | 'categorias';

interface ItemRelatorio {
  id: number;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

function Relatorios() {
  const [tipoVisualizacao, setTipoVisualizacao] = useState<TipoVisualizacao>('pessoas');
  const [itensRelatorio, setItensRelatorio] = useState<ItemRelatorio[]>([]);
  const [totalGeral, setTotalGeral] = useState<TotalGeralResponse | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  useEffect(() => {
    document.title = 'Finance Control - Relatórios';
  }, []);

  useEffect(() => {
    carregarDados();
  }, [tipoVisualizacao]);

  const carregarDados = async () => {
    try {
      setCarregando(true);

      if (tipoVisualizacao === 'pessoas') {
        await carregarDadosPorPessoas();
      } else {
        await carregarDadosPorCategorias();
      }

      const totalGeralData = await transacaoService.getTotaisGeral();
      setTotalGeral(totalGeralData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados do relatório');
    } finally {
      setCarregando(false);
    }
  };

  const carregarDadosPorPessoas = async () => {
    const pessoas = await pessoaService.getAll();
    const dadosRelatorio: ItemRelatorio[] = [];

    for (const pessoa of pessoas) {
      try {
        const totais = await transacaoService.getTotaisByPessoa(pessoa.pessoaId);
        dadosRelatorio.push({
          id: pessoa.pessoaId,
          nome: pessoa.nome,
          totalReceitas: totais.totalReceitas,
          totalDespesas: totais.totalDespesas,
          saldo: totais.saldo,
        });
      } catch (error) {
        dadosRelatorio.push({
          id: pessoa.pessoaId,
          nome: pessoa.nome,
          totalReceitas: 0,
          totalDespesas: 0,
          saldo: 0,
        });
      }
    }

    setItensRelatorio(dadosRelatorio);
  };

  const carregarDadosPorCategorias = async () => {
    const categorias = await categoriaService.getAll();
    const dadosRelatorio: ItemRelatorio[] = [];

    for (const categoria of categorias) {
      try {
        const totais = await transacaoService.getTotaisByCategoria(categoria.categoriaId);
        dadosRelatorio.push({
          id: categoria.categoriaId,
          nome: categoria.descricao,
          totalReceitas: totais.totalReceitas,
          totalDespesas: totais.totalDespesas,
          saldo: totais.total,
        });
      } catch (error) {
        dadosRelatorio.push({
          id: categoria.categoriaId,
          nome: categoria.descricao,
          totalReceitas: 0,
          totalDespesas: 0,
          saldo: 0,
        });
      }
    }

    setItensRelatorio(dadosRelatorio);
  };

  const alternarVisualizacao = () => {
    setTipoVisualizacao(tipoVisualizacao === 'pessoas' ? 'categorias' : 'pessoas');
    setPaginaAtual(1);
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const totalPaginas = Math.ceil(itensRelatorio.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const itensPaginados = itensRelatorio.slice(indiceInicio, indiceFim);

  if (carregando) {
    return <div className="loading">Carregando relatórios...</div>;
  }

  return (
    <div className="relatorios-container">
      <div className="page-header">
        <h1>Relatórios</h1>
        <div className="switch-container">
          <span className={tipoVisualizacao === 'pessoas' ? 'active' : ''}>Pessoas</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={tipoVisualizacao === 'categorias'}
              onChange={alternarVisualizacao}
            />
            <span className="slider"></span>
          </label>
          <span className={tipoVisualizacao === 'categorias' ? 'active' : ''}>Categorias</span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>{tipoVisualizacao === 'pessoas' ? 'Pessoa' : 'Categoria'}</th>
              <th className="text-end">Receitas</th>
              <th className="text-end">Despesas</th>
              <th className="text-end">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {itensPaginados.map((item) => (
              <tr key={item.id}>
                <td title={item.nome}>{item.nome}</td>
                <td className="text-end text-success" title={formatarMoeda(item.totalReceitas)}>{formatarMoeda(item.totalReceitas)}</td>
                <td className="text-end text-danger" title={formatarMoeda(item.totalDespesas)}>{formatarMoeda(item.totalDespesas)}</td>
                <td className={`text-end fw-bold ${item.saldo >= 0 ? 'text-success' : 'text-danger'}`} title={formatarMoeda(item.saldo)}>
                  {formatarMoeda(item.saldo)}
                </td>
              </tr>
            ))}
          </tbody>
          {totalGeral && (
            <tfoot>
              <tr className="total-geral">
                <td className="fw-bold">TOTAL GERAL</td>
                <td className="text-end text-success fw-bold">{formatarMoeda(totalGeral.totalReceitas)}</td>
                <td className="text-end text-danger fw-bold">{formatarMoeda(totalGeral.totalDespesas)}</td>
                <td className={`text-end fw-bold ${totalGeral.saldo >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatarMoeda(totalGeral.saldo)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <Paginacao 
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        aoMudarPagina={setPaginaAtual}
      />
    </div>
  );
}

export default Relatorios;
