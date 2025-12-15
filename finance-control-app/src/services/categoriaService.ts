import api from '../config/api';
import type { CategoriaRequest, CategoriaResponse } from '../types/models';

export const categoriaService = {
  getAll: async (): Promise<CategoriaResponse[]> => {
    const response = await api.get<CategoriaResponse[]>('/Categorias');
    return response.data;
  },

  getById: async (id: number): Promise<CategoriaResponse> => {
    const response = await api.get<CategoriaResponse>(`/Categorias/${id}`);
    return response.data;
  },

  create: async (data: CategoriaRequest): Promise<CategoriaResponse> => {
    const response = await api.post<CategoriaResponse>('/Categorias', data);
    return response.data;
  },

  update: async (id: number, data: CategoriaRequest): Promise<CategoriaResponse> => {
    const response = await api.put<CategoriaResponse>(`/Categorias/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/Categorias/${id}`);
  },
};
