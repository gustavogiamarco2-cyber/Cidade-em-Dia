import { Component, computed, inject } from '@angular/core';
import { OcorrenciaService } from '../../shared/ocorrencia-service';

@Component({
  selector: 'app-estatisticas',
  standalone: false,
  styleUrl: './estatisticas.scss',
  templateUrl: './estatisticas.html',
})
export class Estatisticas {
  private readonly servico = inject(OcorrenciaService);

  readonly taxaResolucao = computed(() => {
    const lista = this.servico.lista();
    return lista.length ? Math.round((lista.filter(o => o.status === 'Resolvida').length / lista.length) * 100) : 0;
  });

  readonly grupos = computed(() => [
    { titulo: 'Por status', dados: this.escala(this.servico.contar('status')) },
    { titulo: 'Por urgência', dados: this.escala(this.servico.contar('urgencia')) },
    { titulo: 'Por região', dados: this.escala(this.servico.contar('bairro')) },
  ]);

  private escala(dados: { rotulo: string; total: number }[]) {
    const maximo = Math.max(1, ...dados.map(d => d.total));
    return dados.map(d => ({ ...d, largura: (d.total / maximo) * 100 }));
  }
}
