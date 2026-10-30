import { Component, computed, inject, signal } from '@angular/core';
import { OcorrenciaService } from '../../shared/ocorrencia-service';

@Component({
  selector: 'app-painel',
  standalone: false,
  styleUrl: './painel.scss',
  templateUrl: './painel.html',
})
export class Painel {
  private readonly servico = inject(OcorrenciaService);

  readonly filtros = [
    { rotulo: 'Todas', status: '' },
    { rotulo: 'Novas', status: 'Nova' },
    { rotulo: 'Em análise', status: 'Em análise' },
    { rotulo: 'Em andamento', status: 'Em andamento' },
  ];
  readonly filtro = signal('');

  private readonly abertas = computed(() => this.servico.lista().filter(o => o.status !== 'Resolvida'));
  readonly aguardando = computed(() => this.abertas().length);
  readonly ocorrencias = computed(() => this.abertas().filter(o => !this.filtro() || o.status === this.filtro()));

  atender(id: number, status: string): void {
    if (status === 'Nova') this.servico.atualizarStatus(id, 'Em análise');
  }
}
