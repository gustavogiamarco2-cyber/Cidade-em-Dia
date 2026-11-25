import { Injectable, inject, signal } from '@angular/core';
import { Atendimento } from './models';
import { CHAVES_PERSISTENCIA, PersistenciaLocalService } from './persistencia-local-service';

const ATENDIMENTOS_INICIAIS: Atendimento[] = [
  {
    id: 1,
    ocorrenciaId: 1,
    usuarioId: 2,
    statusAnterior: 'Nova',
    statusNovo: 'Em análise',
    data: new Date('2025-01-10T09:00:00'),
  },
  {
    id: 2,
    ocorrenciaId: 1,
    usuarioId: 2,
    statusAnterior: 'Em análise',
    statusNovo: 'Em andamento',
    data: new Date('2025-01-11T10:00:00'),
  },
  {
    id: 3,
    ocorrenciaId: 2,
    usuarioId: 2,
    statusAnterior: 'Nova',
    statusNovo: 'Em análise',
    data: new Date('2025-01-12T11:00:00'),
  },
  {
    id: 4,
    ocorrenciaId: 5,
    usuarioId: 2,
    statusAnterior: 'Nova',
    statusNovo: 'Em análise',
    data: new Date('2025-01-13T09:00:00'),
  },
  {
    id: 5,
    ocorrenciaId: 5,
    usuarioId: 2,
    statusAnterior: 'Em análise',
    statusNovo: 'Em andamento',
    data: new Date('2025-01-14T10:00:00'),
  },
  {
    id: 6,
    ocorrenciaId: 5,
    usuarioId: 2,
    statusAnterior: 'Em andamento',
    statusNovo: 'Resolvida',
    data: new Date('2025-01-15T11:00:00'),
  },
  {
    id: 7,
    ocorrenciaId: 6,
    usuarioId: 2,
    statusAnterior: 'Nova',
    statusNovo: 'Em análise',
    data: new Date('2025-01-16T09:00:00'),
  },
  {
    id: 8,
    ocorrenciaId: 6,
    usuarioId: 2,
    statusAnterior: 'Em análise',
    statusNovo: 'Em andamento',
    data: new Date('2025-01-17T10:00:00'),
  },
  {
    id: 9,
    ocorrenciaId: 6,
    usuarioId: 2,
    statusAnterior: 'Em andamento',
    statusNovo: 'Resolvida',
    data: new Date('2025-01-18T11:00:00'),
  },
];

type NovoAtendimento = Pick<
  Atendimento,
  'ocorrenciaId' | 'usuarioId' | 'statusAnterior' | 'statusNovo'
>;

const STATUS_VALIDOS = new Set(['Nova', 'Em análise', 'Em andamento', 'Resolvida']);

@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  private readonly persistencia = inject(PersistenciaLocalService);
  private readonly dadosSalvos = this.persistencia.lerLista<unknown>(
    CHAVES_PERSISTENCIA.atendimentos,
  );
  private readonly _lista = signal<Atendimento[]>(
    this.dadosSalvos === undefined ? ATENDIMENTOS_INICIAIS : this.normalizar(this.dadosSalvos),
  );

  readonly lista = this._lista.asReadonly();

  constructor() {
    this.persistir();
  }

  registrar(dados: NovoAtendimento): Atendimento {
    const atendimento: Atendimento = {
      ...dados,
      id: Math.max(0, ...this._lista().map((item) => item.id)) + 1,
      data: new Date(),
    };
    this.atualizarLista((lista) => [...lista, atendimento]);
    return atendimento;
  }

  possuiRegistrosDoUsuario(usuarioId: number): boolean {
    return this._lista().some((atendimento) => atendimento.usuarioId === usuarioId);
  }

  possuiRegistrosDaOcorrencia(ocorrenciaId: number): boolean {
    return this._lista().some((atendimento) => atendimento.ocorrenciaId === ocorrenciaId);
  }

  reconciliarRelacionamentos(ocorrenciaIds: Set<number>, usuarioIds: Set<number>): void {
    const listaAtual = this._lista();
    const validos = listaAtual.filter(
      (atendimento) =>
        ocorrenciaIds.has(atendimento.ocorrenciaId) && usuarioIds.has(atendimento.usuarioId),
    );
    if (validos.length !== listaAtual.length) this.atualizarLista(() => validos);
  }

  private normalizar(dados: unknown[]): Atendimento[] {
    const atendimentos: Atendimento[] = [];
    for (const item of dados) {
      if (!item || typeof item !== 'object') continue;
      const registro = item as Partial<Atendimento>;
      if (
        !Number.isInteger(registro.id) ||
        Number(registro.id) <= 0 ||
        !Number.isInteger(registro.ocorrenciaId) ||
        Number(registro.ocorrenciaId) <= 0 ||
        !Number.isInteger(registro.usuarioId) ||
        Number(registro.usuarioId) <= 0 ||
        !STATUS_VALIDOS.has(String(registro.statusAnterior)) ||
        !STATUS_VALIDOS.has(String(registro.statusNovo))
      ) {
        continue;
      }
      if (atendimentos.some((atendimento) => atendimento.id === registro.id)) continue;
      const data = registro.data instanceof Date ? registro.data : new Date(String(registro.data));
      if (Number.isNaN(data.getTime())) continue;
      atendimentos.push({
        id: Number(registro.id),
        ocorrenciaId: Number(registro.ocorrenciaId),
        usuarioId: Number(registro.usuarioId),
        statusAnterior: registro.statusAnterior!,
        statusNovo: registro.statusNovo!,
        data,
      });
    }
    return atendimentos;
  }

  private atualizarLista(atualizar: (lista: Atendimento[]) => Atendimento[]): void {
    this._lista.update(atualizar);
    this.persistir();
  }

  private persistir(): void {
    this.persistencia.salvarLista(CHAVES_PERSISTENCIA.atendimentos, this._lista());
  }
}
