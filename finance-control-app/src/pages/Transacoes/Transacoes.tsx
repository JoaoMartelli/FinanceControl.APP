import { useState, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import type { TransacaoResponse, TransacaoRequest, PessoaResponse, CategoriaResponse } from '../../types/models';
import { transacaoService, pessoaService, categoriaService } from '../../services';
import { obterTipos, obterNomeTipo } from '../../types/enumHelpers';
import Modal from '../../components/Modal/Modal';
import ModalConfirmacao from '../../components/ModalConfirmacao/ModalConfirmacao';
import AutocompleteSelect from '../../components/AutocompleteSelect/AutocompleteSelect';
import Paginacao from '../../components/Paginacao/Paginacao';
import './Transacoes.css';

function Transacoes() {
  const [transacoes, setTransacoes] = useState<TransacaoResponse[]>([]);
  const [pessoas, setPessoas] = useState<PessoaResponse[]>([]);
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTransacao, setSelectedTransacao] = useState<TransacaoResponse | null>(null);
  const [editForm, setEditForm] = useState<TransacaoRequest>({ 
    descricao: '', 
    valor: 0, 
    tipo: 1, 
    categoriaId: 0, 
    pessoaId: 0 
  });
  const [addForm, setAddForm] = useState<TransacaoRequest>({ 
    descricao: '', 
    valor: 0, 
    tipo: 1, 
    categoriaId: 0, 
    pessoaId: 0 
  });

  const [filtroDescricao, setFiltroDescricao] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<number | ''>('');
  const [filtroPessoaId, setFiltroPessoaId] = useState<number | ''>('');
  const [filtroCategoriaId, setFiltroCategoriaId] = useState<number | ''>('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  useEffect(() => {
    document.title = 'Finance Control - Transações';
    loadTransacoes();
  }, []);

  const loadTransacoes = async () => {
    try {
      setLoading(true);
      const [transacoesData, pessoasData, categoriasData] = await Promise.all([
        transacaoService.getAll(),
        pessoaService.getAll(),
        categoriaService.getAll()
      ]);
      setTransacoes(transacoesData);
      setPessoas(pessoasData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      alert('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transacao: TransacaoResponse) => {
    setSelectedTransacao(transacao);
    setEditForm({
      descricao: transacao.descricao,
      valor: transacao.valor,
      tipo: transacao.tipo,
      categoriaId: transacao.categoriaId,
      pessoaId: transacao.pessoaId
    });
    setShowEditModal(true);
  };

  const handleDelete = (transacao: TransacaoResponse) => {
    setSelectedTransacao(transacao);
    setShowDeleteModal(true);
  };

  const confirmEdit = async () => {
    if (!selectedTransacao) return;
    try {
      await transacaoService.update(selectedTransacao.transacaoId, editForm);
      setShowEditModal(false);
      loadTransacoes();
    } catch (error) {
      console.error('Erro ao editar transação:', error);
      alert('Erro ao atualizar transação');
    }
  };

  const confirmDelete = async () => {
    if (!selectedTransacao) return;
    try {
      await transacaoService.delete(selectedTransacao.transacaoId);
      setShowDeleteModal(false);
      loadTransacoes();
    } catch (error: any) {
      console.error('Erro ao deletar transação:', error);
      alert('Erro ao excluir transação');
    }
  };

  const handleAdd = () => {
    setAddForm({ descricao: '', valor: 0, tipo: 1, categoriaId: 0, pessoaId: 0 });
    setShowAddModal(true);
  };

  const confirmAdd = async () => {
    try {
      await transacaoService.create(addForm);
      setShowAddModal(false);
      loadTransacoes();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      alert('Erro ao criar transação');
    }
  };

  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter(transacao => {
      const matchDescricao = filtroDescricao === '' || 
        transacao.descricao.toLowerCase().includes(filtroDescricao.toLowerCase());
      const matchTipo = filtroTipo === '' || transacao.tipo === filtroTipo;
      const matchPessoa = filtroPessoaId === '' || transacao.pessoaId === filtroPessoaId;
      const matchCategoria = filtroCategoriaId === '' || transacao.categoriaId === filtroCategoriaId;
      return matchDescricao && matchTipo && matchPessoa && matchCategoria;
    });
  }, [transacoes, filtroDescricao, filtroTipo, filtroPessoaId, filtroCategoriaId]);

  const totalPaginas = Math.ceil(transacoesFiltradas.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const transacoesPaginadas = transacoesFiltradas.slice(indiceInicio, indiceFim);

  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroDescricao, filtroTipo, filtroPessoaId, filtroCategoriaId]);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  const tipos = obterTipos();
  const opcoesPessoas = pessoas.map(p => ({ valor: p.pessoaId, rotulo: p.nome }));
  const opcoesCategorias = categorias.map(c => ({ valor: c.categoriaId, rotulo: c.descricao }));

  return (
    <div className="transacoes-container">
      <div className="page-header">
        <h1>Transações</h1>
        <button className="btn btn-success" onClick={handleAdd}>
          <FaPlus /> Novo
        </button>
      </div>

      <div className="filtros-container">
        <div className="filtro-grupo">
          <label>Filtrar por Descrição:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Digite a descrição..."
            value={filtroDescricao}
            onChange={(e) => setFiltroDescricao(e.target.value)}
          />
        </div>
        <div className="filtro-grupo">
          <label>Filtrar por Tipo:</label>
          <select
            className="form-control"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">Todos</option>
            {tipos.map(t => (
              <option key={t.valor} value={t.valor}>{t.rotulo}</option>
            ))}
          </select>
        </div>
        <div className="filtro-grupo">
          <label>Filtrar por Pessoa:</label>
          <select
            className="form-control"
            value={filtroPessoaId}
            onChange={(e) => setFiltroPessoaId(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">Todas</option>
            {pessoas.map(p => (
              <option key={p.pessoaId} value={p.pessoaId}>{p.nome}</option>
            ))}
          </select>
        </div>
        <div className="filtro-grupo">
          <label>Filtrar por Categoria:</label>
          <select
            className="form-control"
            value={filtroCategoriaId}
            onChange={(e) => setFiltroCategoriaId(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">Todas</option>
            {categorias.map(c => (
              <option key={c.categoriaId} value={c.categoriaId}>{c.descricao}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Pessoa</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transacoesPaginadas.map((transacao) => (
              <tr key={transacao.transacaoId}>
                <td title={transacao.descricao}>{transacao.descricao}</td>
                <td title={`R$ ${transacao.valor.toFixed(2)}`}>R$ {transacao.valor.toFixed(2)}</td>
                <td title={obterNomeTipo(transacao.tipo)}>{obterNomeTipo(transacao.tipo)}</td>
                <td title={transacao.pessoaNome}>{transacao.pessoaNome}</td>
                <td title={transacao.categoriaNome}>{transacao.categoriaNome}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary me-2" 
                    onClick={() => handleEdit(transacao)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(transacao)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transacoesFiltradas.length === 0 && (
          <div className="sem-resultados">Nenhuma transação encontrada</div>
        )}
      </div>

      <Paginacao 
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        aoMudarPagina={setPaginaAtual}
      />

      <Modal
        mostrar={showEditModal}
        aoFechar={() => setShowEditModal(false)}
        titulo="Editar Transação"
      >
        <div className="form-group">
          <label>Descrição:</label>
          <input
            type="text"
            className="form-control"
            value={editForm.descricao}
            onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Valor:</label>
          <input
            type="number"
            className="form-control"
            value={editForm.valor}
            onChange={(e) => setEditForm({ ...editForm, valor: Number(e.target.value) })}
          />
        </div>
        <div className="form-group">
          <label>Tipo:</label>
          <select
            className="form-control"
            value={editForm.tipo}
            onChange={(e) => setEditForm({ ...editForm, tipo: Number(e.target.value) })}
          >
            {tipos.map(t => (
              <option key={t.valor} value={t.valor}>{t.rotulo}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <AutocompleteSelect
            opcoes={opcoesPessoas}
            valorSelecionado={editForm.pessoaId}
            aoSelecionar={(valor) => setEditForm({ ...editForm, pessoaId: valor })}
            placeholder="Digite para filtrar pessoas..."
            rotulo="Pessoa:"
          />
        </div>
        <div className="form-group">
          <AutocompleteSelect
            opcoes={opcoesCategorias}
            valorSelecionado={editForm.categoriaId}
            aoSelecionar={(valor) => setEditForm({ ...editForm, categoriaId: valor })}
            placeholder="Digite para filtrar categorias..."
            rotulo="Categoria:"
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={confirmEdit}>
            Confirmar
          </button>
        </div>
      </Modal>

      <ModalConfirmacao
        mostrar={showDeleteModal}
        aoFechar={() => setShowDeleteModal(false)}
        aoConfirmar={confirmDelete}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir a transação "${selectedTransacao?.descricao}"?`}
        textoBotaoConfirmar="Confirmar"
        tipoBotaoConfirmar="danger"
      />

      <Modal
        mostrar={showAddModal}
        aoFechar={() => setShowAddModal(false)}
        titulo="Nova Transação"
      >
        <div className="form-group">
          <label>Descrição:</label>
          <input
            type="text"
            className="form-control"
            value={addForm.descricao}
            onChange={(e) => setAddForm({ ...addForm, descricao: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Valor:</label>
          <input
            type="number"
            className="form-control"
            value={addForm.valor}
            onChange={(e) => setAddForm({ ...addForm, valor: Number(e.target.value) })}
          />
        </div>
        <div className="form-group">
          <label>Tipo:</label>
          <select
            className="form-control"
            value={addForm.tipo}
            onChange={(e) => setAddForm({ ...addForm, tipo: Number(e.target.value) })}
          >
            {tipos.map(t => (
              <option key={t.valor} value={t.valor}>{t.rotulo}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <AutocompleteSelect
            opcoes={opcoesPessoas}
            valorSelecionado={addForm.pessoaId}
            aoSelecionar={(valor) => setAddForm({ ...addForm, pessoaId: valor })}
            placeholder="Digite para filtrar pessoas..."
            rotulo="Pessoa:"
          />
        </div>
        <div className="form-group">
          <AutocompleteSelect
            opcoes={opcoesCategorias}
            valorSelecionado={addForm.categoriaId}
            aoSelecionar={(valor) => setAddForm({ ...addForm, categoriaId: valor })}
            placeholder="Digite para filtrar categorias..."
            rotulo="Categoria:"
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
            Cancelar
          </button>
          <button className="btn btn-success" onClick={confirmAdd}>
            Adicionar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Transacoes;
