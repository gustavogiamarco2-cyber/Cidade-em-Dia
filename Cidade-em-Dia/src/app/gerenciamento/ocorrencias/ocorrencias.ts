import { Component, computed, inject, signal } from '@angular/core';
import { CategoriaService } from '../../shared/categoria-service';
import { NIVEIS, STATUS } from '../../shared/models';
import { OcorrenciaService } from '../../shared/ocorrencia-service';

@Component({
  selector: 'app-ocorrencias',
  standalone: false,
  styleUrl: './ocorrencias.scss',
  templateUrl: './ocorrencias.html',
})
export class Ocorrencias {
  private readonly servico = inject(OcorrenciaService);

  readonly categorias = inject(CategoriaService).lista;
  readonly statusOpcoes = STATUS;
  readonly niveis = NIVEIS;
  readonly colunas = ['titulo', 'categoria', 'endereco', 'prioridade', 'status', 'acao'];

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
}
