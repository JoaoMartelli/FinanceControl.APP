import { FinalidadeEnum, TipoEnum } from './enums';

export interface CategoriaRequest {
  descricao: string;
  finalidade: FinalidadeEnum;
}

export interface CategoriaResponse {
  categoriaId: number;
  descricao: string;
  finalidade: FinalidadeEnum;
}

export interface PessoaRequest {
  nome: string;
  idade: number;
}

export interface PessoaResponse {
  pessoaId: number;
  nome: string;
  idade: number;
}

export interface TransacaoRequest {
  descricao: string;
  valor: number;
  tipo: TipoEnum;
  categoriaId: number;
  pessoaId: number;
}

export interface TransacaoResponse {
  transacaoId: number;
  descricao: string;
  valor: number;
  tipo: TipoEnum;
  categoriaId: number;
  categoriaNome: string;
  pessoaId: number;
  pessoaNome: string;
}

export interface TotalPorPessoaResponse {
  pessoaId: number;
  pessoaNome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotalPorCategoriaResponse {
  categoriaId: number;
  categoriaNome: string;
  totalReceitas: number;
  totalDespesas: number;
  total: number;
}

export interface TotalGeralResponse {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}
