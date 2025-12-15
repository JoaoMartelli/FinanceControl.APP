import api from '../config/api';
import { TipoEnum } from '../types/enums';
import type {
  TransacaoRequest,
  TransacaoResponse,
  TotalPorPessoaResponse,
  TotalPorCategoriaResponse,
  TotalGeralResponse,
} from '../types/models';

export const transacaoService = {
  getAll: async (): Promise<TransacaoResponse[]> => {
    const response = await api.get<TransacaoResponse[]>('/Transacoes');
    return response.data;
  },

  getById: async (id: number): Promise<TransacaoResponse> => {
    const response = await api.get<TransacaoResponse>(`/Transacoes/${id}`);
    return response.data;
  },

  create: async (data: TransacaoRequest): Promise<TransacaoResponse> => {
    const response = await api.post<TransacaoResponse>('/Transacoes', data);
    return response.data;
  },

  update: async (id: number, data: TransacaoRequest): Promise<TransacaoResponse> => {
    const response = await api.put<TransacaoResponse>(`/Transacoes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Transacoes/${id}`);
  },

  getByPessoa: async (pessoaId: number): Promise<TransacaoResponse[]> => {
    const response = await api.get<TransacaoResponse[]>(`/Transacoes/pessoa/${pessoaId}`);
    return response.data;
  },

  getByCategoria: async (categoriaId: number): Promise<TransacaoResponse[]> => {
    const response = await api.get<TransacaoResponse[]>(`/Transacoes/categoria/${categoriaId}`);
    return response.data;
  },

  getByTipo: async (tipo: TipoEnum): Promise<TransacaoResponse[]> => {
    const response = await api.get<TransacaoResponse[]>(`/Transacoes/tipo/${tipo}`);
    return response.data;
  },

  getTotaisByPessoa: async (pessoaId: number): Promise<TotalPorPessoaResponse> => {
    const response = await api.get<TotalPorPessoaResponse>(`/Transacoes/totais/pessoa/${pessoaId}`);
    return response.data;
  },

  getTotaisByCategoria: async (categoriaId: number): Promise<TotalPorCategoriaResponse> => {
    const response = await api.get<TotalPorCategoriaResponse>(`/Transacoes/totais/categoria/${categoriaId}`);
    return response.data;
  },

  getTotaisGeral: async (): Promise<TotalGeralResponse> => {
    const response = await api.get<TotalGeralResponse>('/Transacoes/totais/geral');
    return response.data;
  },
};
