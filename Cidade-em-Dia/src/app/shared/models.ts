export type Perfil = 'cidadao' | 'atendente' | 'admin';
export type Status = 'Nova' | 'Em análise' | 'Em andamento' | 'Resolvida';
export type Nivel = 'Baixa' | 'Média' | 'Alta';

export const STATUS: Status[] = ['Nova', 'Em análise', 'Em andamento', 'Resolvida'];
export const NIVEIS: Nivel[] = ['Baixa', 'Média', 'Alta'];

export interface Ocorrencia {
  id: number;
  titulo: string;
  categoria: string;
  descricao: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  referencia: string;
  urgencia: Nivel;
  prioridade: Nivel;
  status: Status;
  confirmacoes: number;
  foto?: string;
}

export type NovaOcorrencia = Pick<
  Ocorrencia,
  'categoria' | 'descricao' | 'urgencia' | 'rua' | 'numero' | 'bairro' | 'cidade' | 'referencia' | 'foto'
>;

export interface CategoriaDados {
  id: number;
  nome: string;
  ativa: boolean;
}

export interface UsuarioDados {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
}
