export interface ExpenseType {
  id: string;
  name: string;
  amount: string;
  percentage: string;
  date: string;
  category?: string;
}

export interface IncomeType {
  id: string;
  name: string;
  amount: string;
}

export interface SpendingType {
  id: string;
  name: string;
  amount: string;
  date: string;
  category?: string;
}
export type Topico = {
  subtitulo: string;
  conteudo: string;
};

export type Artigo = {
  titulo: string;
  descricao: string;
  topicos: Topico[];
};

export type TextosJSON = {
  [key: string]: Artigo;
};
