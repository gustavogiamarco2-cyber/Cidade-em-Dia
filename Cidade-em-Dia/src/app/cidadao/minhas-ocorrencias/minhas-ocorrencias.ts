import { Component, computed, inject, signal } from '@angular/core';
import { OcorrenciaService } from '../../shared/ocorrencia-service';

@Component({
  selector: 'app-minhas-ocorrencias',
  standalone: false,
  styleUrl: './minhas-ocorrencias.scss',
  templateUrl: './minhas-ocorrencias.html',
})
export class MinhasOcorrencias {
  private readonly servico = inject(OcorrenciaService);

  readonly filtros = ['Todas', 'Em análise', 'Em andamento', 'Resolvidas'];
  readonly filtro = signal('Todas');

  readonly ocorrencias = computed(() => {
    const f = this.filtro();
    const status = f === 'Resolvidas' ? 'Resolvida' : f;
    return this.servico.lista().filter(o => f === 'Todas' || o.status === status);
  });
}
