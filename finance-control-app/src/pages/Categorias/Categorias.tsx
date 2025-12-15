import { useState, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import type { CategoriaResponse, CategoriaRequest } from '../../types/models';
import { FinalidadeEnum } from '../../types/enums';
import { obterFinalidades, obterNomeFinalidade } from '../../types/enumHelpers';
import { categoriaService } from '../../services';
import Modal from '../../components/Modal/Modal';
import ModalConfirmacao from '../../components/ModalConfirmacao/ModalConfirmacao';
import Paginacao from '../../components/Paginacao/Paginacao';
import './Categorias.css';

function Categorias() {
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModalEdicao, setMostrarModalEdicao] = useState(false);
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
  const [mostrarModalAdicao, setMostrarModalAdicao] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaResponse | null>(null);
  const [formularioEdicao, setFormularioEdicao] = useState<CategoriaRequest>({ descricao: '', finalidade: FinalidadeEnum.Despesa });
  const [formularioAdicao, setFormularioAdicao] = useState<CategoriaRequest>({ descricao: '', finalidade: FinalidadeEnum.Despesa });
  
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroFinalidade, setFiltroFinalidade] = useState<number | ''>('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  useEffect(() => {
    document.title = 'Finance Control - Categorias';
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      setCarregando(true);
      const data = await categoriaService.getAll();
      setCategorias(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      alert('Erro ao carregar categorias');
    } finally {
      setCarregando(false);
    }
  };

  const abrirModalEdicao = (categoria: CategoriaResponse) => {
    setCategoriaSelecionada(categoria);
    setFormularioEdicao({ descricao: categoria.descricao, finalidade: categoria.finalidade });
    setMostrarModalEdicao(true);
  };

  const abrirModalExclusao = (categoria: CategoriaResponse) => {
    setCategoriaSelecionada(categoria);
    setMostrarModalExclusao(true);
  };

  const confirmarEdicao = async () => {
    if (!categoriaSelecionada) return;
    try {
      await categoriaService.update(categoriaSelecionada.categoriaId, formularioEdicao);
      setMostrarModalEdicao(false);
      carregarCategorias();
    } catch (error) {
      console.error('Erro ao editar categoria:', error);
      alert('Erro ao atualizar categoria');
    }
  };

  const confirmarExclusao = async () => {
    if (!categoriaSelecionada) return;
    try {
      await categoriaService.delete(categoriaSelecionada.categoriaId);
      setMostrarModalExclusao(false);
      carregarCategorias();
    } catch (error: any) {
      console.error('Erro ao deletar categoria:', error);
      const mensagem = error.response?.status === 409 || error.response?.data?.includes?.('vinculad') || error.response?.data?.includes?.('constraint')
        ? 'Não é possível excluir esta categoria pois existem transações vinculadas'
        : 'Erro ao excluir categoria';
      alert(mensagem);
    }
  };

  const abrirModalAdicao = () => {
    setFormularioAdicao({ descricao: '', finalidade: FinalidadeEnum.Despesa });
    setMostrarModalAdicao(true);
  };

  const confirmarAdicao = async () => {
    try {
      await categoriaService.create(formularioAdicao);
      setMostrarModalAdicao(false);
      carregarCategorias();
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      alert('Erro ao criar categoria');
    }
  };

  const categoriasFiltradas = useMemo(() => {
    return categorias.filter(categoria => {
      const matchNome = filtroNome === '' || 
        categoria.descricao.toLowerCase().includes(filtroNome.toLowerCase());
      const matchFinalidade = filtroFinalidade === '' || 
        categoria.finalidade === filtroFinalidade;
      return matchNome && matchFinalidade;
    });
  }, [categorias, filtroNome, filtroFinalidade]);

  const totalPaginas = Math.ceil(categoriasFiltradas.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const categoriasPaginadas = categoriasFiltradas.slice(indiceInicio, indiceFim);

  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroNome, filtroFinalidade]);

  if (carregando) {
    return <div className="loading">Carregando...</div>;
  }

  const finalidades = obterFinalidades();

  return (
    <div className="categorias-container">
      <div className="page-header">
        <h1>Categorias</h1>
        <button className="btn btn-success" onClick={abrirModalAdicao}>
          <FaPlus /> Novo
        </button>
      </div>

      <div className="filtros-container">
        <div className="filtro-grupo">
          <label>Filtrar por Nome:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Digite o nome..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
        </div>
        <div className="filtro-grupo">
          <label>Filtrar por Finalidade:</label>
          <select
            className="form-control"
            value={filtroFinalidade}
            onChange={(e) => setFiltroFinalidade(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">Todas</option>
            {finalidades.map(f => (
              <option key={f.valor} value={f.valor}>{f.rotulo}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Finalidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categoriasPaginadas.map((categoria) => (
              <tr key={categoria.categoriaId}>
                <td title={categoria.descricao}>{categoria.descricao}</td>
                <td title={obterNomeFinalidade(categoria.finalidade)}>{obterNomeFinalidade(categoria.finalidade)}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary me-2" 
                    onClick={() => abrirModalEdicao(categoria)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => abrirModalExclusao(categoria)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categoriasFiltradas.length === 0 && (
          <div className="sem-resultados">Nenhuma categoria encontrada</div>
        )}
      </div>

      <Paginacao 
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        aoMudarPagina={setPaginaAtual}
      />

      <Modal 
        mostrar={mostrarModalEdicao} 
        aoFechar={() => setMostrarModalEdicao(false)}
        titulo="Editar Categoria"
      >
        <div className="form-group">
          <label>Descrição:</label>
          <input
            type="text"
            className="form-control"
            value={formularioEdicao.descricao}
            onChange={(e) => setFormularioEdicao({ ...formularioEdicao, descricao: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Finalidade:</label>
          <select
            className="form-control"
            value={formularioEdicao.finalidade}
            onChange={(e) => setFormularioEdicao({ ...formularioEdicao, finalidade: Number(e.target.value) as FinalidadeEnum })}
          >
            {finalidades.map(f => (
              <option key={f.valor} value={f.valor}>{f.rotulo}</option>
            ))}
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setMostrarModalEdicao(false)}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={confirmarEdicao}>
            Confirmar
          </button>
        </div>
      </Modal>

      <ModalConfirmacao
        mostrar={mostrarModalExclusao}
        aoFechar={() => setMostrarModalExclusao(false)}
        aoConfirmar={confirmarExclusao}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir a categoria ${categoriaSelecionada?.descricao}?`}
      />

      <Modal 
        mostrar={mostrarModalAdicao} 
        aoFechar={() => setMostrarModalAdicao(false)}
        titulo="Nova Categoria"
      >
        <div className="form-group">
          <label>Descrição:</label>
          <input
            type="text"
            className="form-control"
            value={formularioAdicao.descricao}
            onChange={(e) => setFormularioAdicao({ ...formularioAdicao, descricao: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Finalidade:</label>
          <select
            className="form-control"
            value={formularioAdicao.finalidade}
            onChange={(e) => setFormularioAdicao({ ...formularioAdicao, finalidade: Number(e.target.value) as FinalidadeEnum })}
          >
            {finalidades.map(f => (
              <option key={f.valor} value={f.valor}>{f.rotulo}</option>
            ))}
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setMostrarModalAdicao(false)}>
            Cancelar
          </button>
          <button className="btn btn-success" onClick={confirmarAdicao}>
            Adicionar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Categorias;
