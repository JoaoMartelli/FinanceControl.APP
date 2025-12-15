import { useState, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import type { PessoaResponse, PessoaRequest } from '../../types/models';
import { pessoaService } from '../../services';
import Paginacao from '../../components/Paginacao/Paginacao';
import './Pessoas.css';

function Pessoas() {
  const [pessoas, setPessoas] = useState<PessoaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState<PessoaResponse | null>(null);
  const [editForm, setEditForm] = useState<PessoaRequest>({ nome: '', idade: 0 });
  const [addForm, setAddForm] = useState<PessoaRequest>({ nome: '', idade: 0 });

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroIdadeExata, setFiltroIdadeExata] = useState<number | ''>('');
  const [filtroIdadeMin, setFiltroIdadeMin] = useState<number | ''>('');
  const [filtroIdadeMax, setFiltroIdadeMax] = useState<number | ''>('');
  const [tipoFiltroIdade, setTipoFiltroIdade] = useState<'exata' | 'faixa'>('exata');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  useEffect(() => {
    document.title = 'Finance Control - Pessoas';
    loadPessoas();
  }, []);

  const loadPessoas = async () => {
    try {
      setLoading(true);
      const data = await pessoaService.getAll();
      setPessoas(data);
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
      alert('Erro ao carregar pessoas');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pessoa: PessoaResponse) => {
    setSelectedPessoa(pessoa);
    setEditForm({ nome: pessoa.nome, idade: pessoa.idade });
    setShowEditModal(true);
  };

  const handleDelete = (pessoa: PessoaResponse) => {
    setSelectedPessoa(pessoa);
    setShowDeleteModal(true);
  };

  const confirmEdit = async () => {
    if (!selectedPessoa) return;
    try {
      await pessoaService.update(selectedPessoa.pessoaId, editForm);
      setShowEditModal(false);
      loadPessoas();
    } catch (error) {
      console.error('Erro ao editar pessoa:', error);
      alert('Erro ao atualizar pessoa');
    }
  };

  const confirmDelete = async () => {
    if (!selectedPessoa) return;
    try {
      await pessoaService.delete(selectedPessoa.pessoaId);
      setShowDeleteModal(false);
      loadPessoas();
    } catch (error: any) {
      console.error('Erro ao deletar pessoa:', error);
      const mensagem = error.response?.status === 409 || error.response?.data?.includes?.('vinculad') || error.response?.data?.includes?.('constraint')
        ? 'Não é possível excluir esta pessoa pois existem transações vinculadas'
        : 'Erro ao excluir pessoa';
      alert(mensagem);
    }
  };

  const handleAdd = () => {
    setAddForm({ nome: '', idade: 0 });
    setShowAddModal(true);
  };

  const confirmAdd = async () => {
    try {
      await pessoaService.create(addForm);
      setShowAddModal(false);
      loadPessoas();
    } catch (error) {
      console.error('Erro ao adicionar pessoa:', error);
      alert('Erro ao criar pessoa');
    }
  };

  const pessoasFiltradas = useMemo(() => {
    return pessoas.filter(pessoa => {
      const matchNome = filtroNome === '' || 
        pessoa.nome.toLowerCase().includes(filtroNome.toLowerCase());
      
      let matchIdade = true;
      if (tipoFiltroIdade === 'exata' && filtroIdadeExata !== '') {
        matchIdade = pessoa.idade === filtroIdadeExata;
      } else if (tipoFiltroIdade === 'faixa') {
        if (filtroIdadeMin !== '' && pessoa.idade < filtroIdadeMin) matchIdade = false;
        if (filtroIdadeMax !== '' && pessoa.idade > filtroIdadeMax) matchIdade = false;
      }
      
      return matchNome && matchIdade;
    });
  }, [pessoas, filtroNome, filtroIdadeExata, filtroIdadeMin, filtroIdadeMax, tipoFiltroIdade]);

  const totalPaginas = Math.ceil(pessoasFiltradas.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const pessoasPaginadas = pessoasFiltradas.slice(indiceInicio, indiceFim);

  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroNome, filtroIdadeExata, filtroIdadeMin, filtroIdadeMax, tipoFiltroIdade]);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="pessoas-container">
      <div className="page-header">
        <h1>Pessoas</h1>
        <button className="btn btn-success" onClick={handleAdd}>
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
          <label>Tipo de Filtro de Idade:</label>
          <select
            className="form-control"
            value={tipoFiltroIdade}
            onChange={(e) => {
              setTipoFiltroIdade(e.target.value as 'exata' | 'faixa');
              setFiltroIdadeExata('');
              setFiltroIdadeMin('');
              setFiltroIdadeMax('');
            }}
          >
            <option value="exata">Idade Exata</option>
            <option value="faixa">Faixa de Idade</option>
          </select>
        </div>
        {tipoFiltroIdade === 'exata' ? (
          <div className="filtro-grupo">
            <label>Idade:</label>
            <input
              type="number"
              className="form-control"
              placeholder="Ex: 25"
              value={filtroIdadeExata}
              onChange={(e) => setFiltroIdadeExata(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        ) : (
          <>
            <div className="filtro-grupo">
              <label>Idade Mínima:</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ex: 18"
                value={filtroIdadeMin}
                onChange={(e) => setFiltroIdadeMin(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div className="filtro-grupo">
              <label>Idade Máxima:</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ex: 65"
                value={filtroIdadeMax}
                onChange={(e) => setFiltroIdadeMax(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </>
        )}
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pessoasPaginadas.map((pessoa) => (
              <tr key={pessoa.pessoaId}>
                <td title={pessoa.nome}>{pessoa.nome}</td>
                <td title={pessoa.idade.toString()}>{pessoa.idade}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary me-2" 
                    onClick={() => handleEdit(pessoa)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(pessoa)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pessoasFiltradas.length === 0 && (
          <div className="sem-resultados">Nenhuma pessoa encontrada</div>
        )}
      </div>

      <Paginacao 
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        aoMudarPagina={setPaginaAtual}
      />

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Pessoa</h2>
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                className="form-control"
                value={editForm.nome}
                onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Idade:</label>
              <input
                type="number"
                className="form-control"
                value={editForm.idade}
                onChange={(e) => setEditForm({ ...editForm, idade: Number(e.target.value) })}
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
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir a pessoa <strong>{selectedPessoa?.nome}</strong>?</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Nova Pessoa</h2>
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                className="form-control"
                value={addForm.nome}
                onChange={(e) => setAddForm({ ...addForm, nome: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Idade:</label>
              <input
                type="number"
                className="form-control"
                value={addForm.idade}
                onChange={(e) => setAddForm({ ...addForm, idade: Number(e.target.value) })}
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
          </div>
        </div>
      )}
    </div>
  );
}

export default Pessoas;
