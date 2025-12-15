import { FinalidadeEnum, TipoEnum } from './enums';

export const obterFinalidades = () => [
  { valor: FinalidadeEnum.Despesa, rotulo: 'Despesa' },
  { valor: FinalidadeEnum.Receita, rotulo: 'Receita' },
  { valor: FinalidadeEnum.Ambas, rotulo: 'Ambas' }
];

export const obterTipos = () => [
  { valor: TipoEnum.Despesa, rotulo: 'Despesa' },
  { valor: TipoEnum.Receita, rotulo: 'Receita' }
];

export const obterNomeFinalidade = (finalidade: FinalidadeEnum): string => {
  switch (finalidade) {
    case FinalidadeEnum.Despesa:
      return 'Despesa';
    case FinalidadeEnum.Receita:
      return 'Receita';
    case FinalidadeEnum.Ambas:
      return 'Ambas';
    default:
      return 'Desconhecido';
  }
};

export const obterNomeTipo = (tipo: TipoEnum): string => {
  switch (tipo) {
    case TipoEnum.Despesa:
      return 'Despesa';
    case TipoEnum.Receita:
      return 'Receita';
    default:
      return 'Desconhecido';
  }
};
