import { Component, computed, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AutenticacaoService } from '../../compartilhado/autenticacao-service';
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
  private readonly auth = inject(AutenticacaoService);

  readonly categoriaService = inject(CategoriaService);
  readonly categorias = this.categoriaService.lista;
  readonly statusOpcoes = STATUS;
  readonly niveis = NIVEIS;
  readonly colunas = ['titulo', 'categoria', 'endereco', 'prioridade', 'status', 'acoes'];

  readonly categoriaId = signal(0);
  readonly status = signal('');
  readonly prioridade = signal('');

  readonly ocorrencias = computed(() =>
    this.servico.filtrar({
      categoriaId: this.categoriaId(),
      status: this.status(),
      prioridade: this.prioridade(),
    }),
  );

  novaOcorrencia(): void {
    this.dialogo
      .open(OcorrenciaDialogo, {
        data: { categorias: this.categorias() },
      })
      .afterClosed()
      .subscribe((dados) => {
        if (!dados) return;
        const usuarioId = this.auth.usuarioId();
        if (usuarioId === null) {
          this.snackBar.open('Não foi possível identificar o usuário da sessão.', 'OK', {
            duration: 3000,
          });
          return;
        }
        this.servico.registrar(dados, usuarioId);
        this.snackBar.open('Ocorrência cadastrada.', 'OK', { duration: 3000 });
      });
  }

  editarOcorrencia(ocorrencia: Ocorrencia): void {
    this.dialogo
      .open(OcorrenciaDialogo, {
        data: {
          categorias: this.categorias(),
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
    if (!this.servico.excluir(ocorrencia.id)) {
      this.snackBar.open(
        'Não é possível excluir uma ocorrência com histórico de atendimento.',
        'OK',
        { duration: 4000 },
      );
      return;
    }
    this.snackBar.open('Ocorrência excluída.', 'OK', { duration: 3000 });
  }
}
