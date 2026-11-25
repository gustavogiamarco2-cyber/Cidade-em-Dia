import { Component, computed, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AutenticacaoService } from '../../compartilhado/autenticacao-service';
import { CategoriaService } from '../../compartilhado/categoria-service';
import { OcorrenciaService } from '../../compartilhado/ocorrencia-service';

@Component({
  selector: 'app-painel',
  standalone: false,
  styleUrl: './painel.scss',
  templateUrl: './painel.html',
})
export class Painel {
  private readonly servico = inject(OcorrenciaService);
  private readonly auth = inject(AutenticacaoService);
  private readonly snackBar = inject(MatSnackBar);
  readonly categorias = inject(CategoriaService);

  readonly filtros = [
    { rotulo: 'Todas', status: '' },
    { rotulo: 'Novas', status: 'Nova' },
    { rotulo: 'Em análise', status: 'Em análise' },
    { rotulo: 'Em andamento', status: 'Em andamento' },
  ];
  readonly filtro = signal('');

  private readonly abertas = computed(() =>
    this.servico.lista().filter((o) => o.status !== 'Resolvida'),
  );
  readonly aguardando = computed(() => this.abertas().length);
  readonly ocorrencias = computed(() =>
    this.abertas().filter((o) => !this.filtro() || o.status === this.filtro()),
  );

  atender(id: number, status: string): void {
    if (status !== 'Nova') return;
    const usuarioId = this.auth.usuarioId();
    if (usuarioId === null) {
      this.snackBar.open('Não foi possível identificar o usuário da sessão.', 'OK', {
        duration: 3000,
      });
      return;
    }
    this.servico.atualizarStatus(id, 'Em análise', usuarioId);
  }
}
