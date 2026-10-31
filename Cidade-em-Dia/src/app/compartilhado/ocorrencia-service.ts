import { Injectable, signal } from '@angular/core';
import { NovaOcorrencia, Ocorrencia, Status } from './models';

export interface FiltroOcorrencia {
  categoria?: string;
  status?: string;
  prioridade?: string;
  bairro?: string;
}

// Dados em memória: ainda não há API.
@Injectable({ providedIn: 'root' })
export class OcorrenciaService {
  private readonly _lista = signal<Ocorrencia[]>([
    { id: 1, titulo: 'Buraco na Rua XV', categoria: 'Buraco', descricao: 'Buraco de grande dimensão localizado próximo à esquina.', rua: 'Rua XV', numero: '120', bairro: 'Centro', cidade: 'Curitiba', referencia: '', urgencia: 'Alta', prioridade: 'Alta', status: 'Em andamento', confirmacoes: 12 },
    { id: 2, titulo: 'Poste sem iluminação', categoria: 'Iluminação', descricao: 'Poste apagado há vários dias.', rua: 'Rua Paraná', numero: '450', bairro: 'Batel', cidade: 'Curitiba', referencia: 'Em frente à padaria', urgencia: 'Média', prioridade: 'Média', status: 'Em análise', confirmacoes: 4 },
    { id: 3, titulo: 'Lixo acumulado', categoria: 'Descarte irregular', descricao: 'Entulho descartado na calçada.', rua: 'Rua das Flores', numero: '88', bairro: 'Centro', cidade: 'Curitiba', referencia: '', urgencia: 'Média', prioridade: 'Média', status: 'Nova', confirmacoes: 2 },
    { id: 4, titulo: 'Vazamento na Av. Brasil', categoria: 'Vazamento', descricao: 'Vazamento de água na calçada.', rua: 'Av. Brasil', numero: '900', bairro: 'Portão', cidade: 'Curitiba', referencia: '', urgencia: 'Alta', prioridade: 'Alta', status: 'Nova', confirmacoes: 7 },
    { id: 5, titulo: 'Placa de pare danificada', categoria: 'Sinalização danificada', descricao: 'Placa torta e ilegível.', rua: 'Rua Bahia', numero: '15', bairro: 'Batel', cidade: 'Curitiba', referencia: '', urgencia: 'Baixa', prioridade: 'Baixa', status: 'Resolvida', confirmacoes: 1 },
    { id: 6, titulo: 'Buraco na Rua Sergipe', categoria: 'Buraco', descricao: 'Buraco na faixa da direita.', rua: 'Rua Sergipe', numero: '300', bairro: 'Portão', cidade: 'Curitiba', referencia: '', urgencia: 'Média', prioridade: 'Média', status: 'Resolvida', confirmacoes: 3 },
  ]);

  readonly lista = this._lista.asReadonly();

  obter(id: number): Ocorrencia | undefined {
    return this._lista().find(o => o.id === id);
  }

  registrar(dados: NovaOcorrencia): Ocorrencia {
    const nova: Ocorrencia = {
      ...dados,
      id: Math.max(0, ...this._lista().map(o => o.id)) + 1,
      titulo: `${dados.categoria} na ${dados.rua}`,
      prioridade: dados.urgencia,
      status: 'Nova',
      confirmacoes: 0,
    };
    this._lista.update(lista => [nova, ...lista]);
    return nova;
  }

  atualizarStatus(id: number, status: Status): void {
    this._lista.update(lista => lista.map(o => (o.id === id ? { ...o, status } : o)));
  }

  confirmar(id: number): void {
    this._lista.update(lista =>
      lista.map(o => (o.id === id ? { ...o, confirmacoes: o.confirmacoes + 1 } : o)),
    );
  }

  filtrar(filtro: FiltroOcorrencia): Ocorrencia[] {
    return this._lista().filter(
      o =>
        (!filtro.categoria || o.categoria === filtro.categoria) &&
        (!filtro.status || o.status === filtro.status) &&
        (!filtro.prioridade || o.prioridade === filtro.prioridade) &&
        (!filtro.bairro || o.bairro === filtro.bairro),
    );
  }

  contar(chave: 'categoria' | 'status' | 'urgencia' | 'bairro'): { rotulo: string; total: number }[] {
    const mapa = new Map<string, number>();
    for (const o of this._lista()) {
      mapa.set(o[chave], (mapa.get(o[chave]) ?? 0) + 1);
    }
    return [...mapa].map(([rotulo, total]) => ({ rotulo, total })).sort((a, b) => b.total - a.total);
  }
}
