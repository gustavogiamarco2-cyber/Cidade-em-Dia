import { Injectable, signal } from '@angular/core';
import { Atendimento } from './models';

type NovoAtendimento = Pick<
  Atendimento,
  'ocorrenciaId' | 'usuarioId' | 'statusAnterior' | 'statusNovo'
>;

@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  private readonly _lista = signal<Atendimento[]>([
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
  ]);

  readonly lista = this._lista.asReadonly();

  registrar(dados: NovoAtendimento): Atendimento {
    const atendimento: Atendimento = {
      ...dados,
      id: Math.max(0, ...this._lista().map((item) => item.id)) + 1,
      data: new Date(),
    };
    this._lista.update((lista) => [...lista, atendimento]);
    return atendimento;
  }

  possuiRegistrosDoUsuario(usuarioId: number): boolean {
    return this._lista().some((atendimento) => atendimento.usuarioId === usuarioId);
  }

  possuiRegistrosDaOcorrencia(ocorrenciaId: number): boolean {
    return this._lista().some((atendimento) => atendimento.ocorrenciaId === ocorrenciaId);
  }
}
