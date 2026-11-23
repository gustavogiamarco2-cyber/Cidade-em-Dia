import { Component, computed, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaService } from '../../compartilhado/categoria-service';
import { NIVEIS, NovaOcorrencia, Ocorrencia, STATUS } from '../../compartilhado/models';
import { OcorrenciaService } from '../../compartilhado/ocorrencia-service';
import { OcorrenciaDialogo } from './ocorrencia-dialogo';

@Component({
  selector: 'app-ocorrencias',
  standalone: false,
  styleUrl: './ocorrencias.scss',
  templateUrl: './ocorrencias.html',
})
export class Ocorrencias {
  private readonly servico = inject(OcorrenciaService);
  private readonly dialogo = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly categorias = inject(CategoriaService).lista;
  readonly statusOpcoes = STATUS;
  readonly niveis = NIVEIS;
  readonly colunas = ['titulo', 'categoria', 'endereco', 'prioridade', 'status', 'acoes'];

  readonly categoria = signal('');
  readonly status = signal('');
  readonly prioridade = signal('');

  readonly ocorrencias = computed(() =>
    this.servico.filtrar({
      categoria: this.categoria(),
      status: this.status(),
      prioridade: this.prioridade(),
    }),
  );

  novaOcorrencia(): void {
    this.dialogo
      .open(OcorrenciaDialogo, {
        data: { categorias: this.categorias().map((categoria) => categoria.nome) },
      })
      .afterClosed()
      .subscribe((dados) => {
        if (!dados) return;
        this.servico.registrar(dados);
        this.snackBar.open('Ocorrência cadastrada.', 'OK', { duration: 3000 });
      });
  }

  editarOcorrencia(ocorrencia: Ocorrencia): void {
    this.dialogo
      .open(OcorrenciaDialogo, {
        data: {
          categorias: this.categorias().map((categoria) => categoria.nome),
          ocorrencia,
        },
      })
      .afterClosed()
      .subscribe((dados: NovaOcorrencia | undefined) => {
        if (!dados) return;
        this.servico.atualizar(ocorrencia.id, dados);
        this.snackBar.open('Ocorrência atualizada.', 'OK', { duration: 3000 });
      });
  }

  excluirOcorrencia(ocorrencia: Ocorrencia): void {
    if (!window.confirm(`Excluir a ocorrência "${ocorrencia.titulo}"?`)) return;
    this.servico.excluir(ocorrencia.id);
    this.snackBar.open('Ocorrência excluída.', 'OK', { duration: 3000 });
  }
}
