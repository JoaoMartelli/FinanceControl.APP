import api from '../config/api';
import type { PessoaRequest, PessoaResponse } from '../types/models';

export const pessoaService = {
  getAll: async (): Promise<PessoaResponse[]> => {
    const response = await api.get<PessoaResponse[]>('/Pessoas');
    return response.data;
  },

  getById: async (id: number): Promise<PessoaResponse> => {
    const response = await api.get<PessoaResponse>(`/Pessoas/${id}`);
    return response.data;
  },

  create: async (data: PessoaRequest): Promise<PessoaResponse> => {
    const response = await api.post<PessoaResponse>('/Pessoas', data);
    return response.data;
  },

  update: async (id: number, data: PessoaRequest): Promise<PessoaResponse> => {
    const response = await api.put<PessoaResponse>(`/Pessoas/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Pessoas/${id}`);
  },
};
