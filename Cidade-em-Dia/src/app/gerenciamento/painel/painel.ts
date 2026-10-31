import { Component, computed, inject, signal } from '@angular/core';
import { CategoriaService } from '../../compartilhado/categoria-service';
import { NIVEIS } from '../../compartilhado/models';
import { OcorrenciaService } from '../../compartilhado/ocorrencia-service';

@Component({
  selector: 'app-painel',
  standalone: false,
  styleUrl: './painel.scss',
  templateUrl: './painel.html',
})
export class Painel {
  private readonly servico = inject(OcorrenciaService);

  readonly categorias = inject(CategoriaService).lista;
  readonly statusOpcoes = ['Nova', 'Em análise', 'Em andamento', 'Resolvida'];
  readonly niveis = NIVEIS;
  readonly colunas = ['id', 'categoria', 'prioridade', 'status'];

  readonly categoria = signal('');
  readonly status = signal('');
  readonly prioridade = signal('');
  readonly bairro = signal('');

  readonly total = computed(() => this.servico.lista().length);
  readonly emAnalise = computed(() => this.servico.lista().filter(o => o.status === 'Em análise').length);
  readonly emAndamento = computed(() => this.servico.lista().filter(o => o.status === 'Em andamento').length);
  readonly resolvidas = computed(() => this.servico.lista().filter(o => o.status === 'Resolvida').length);

  readonly porCategoria = computed(() => {
    const dados = this.servico.contar('categoria');
    const maximo = Math.max(1, ...dados.map(d => d.total));
    return dados.map(d => ({ ...d, largura: (d.total / maximo) * 100 }));
  });

  readonly bairros = computed(() => this.servico.contar('bairro').map(b => b.rotulo));

  readonly ocorrencias = computed(() =>
    this.servico.filtrar({
      categoria: this.categoria(),
      status: this.status(),
      prioridade: this.prioridade(),
      bairro: this.bairro(),
    }),
  );
}
