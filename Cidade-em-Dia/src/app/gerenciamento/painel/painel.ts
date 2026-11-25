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

  readonly categoriaService = inject(CategoriaService);
  readonly categorias = this.categoriaService.lista;
  readonly statusOpcoes = ['Nova', 'Em análise', 'Em andamento', 'Resolvida'];
  readonly niveis = NIVEIS;
  readonly colunas = ['id', 'categoria', 'prioridade', 'status'];

  readonly categoriaId = signal(0);
  readonly status = signal('');
  readonly prioridade = signal('');
  readonly bairro = signal('');

  readonly total = computed(() => this.servico.lista().length);
  readonly emAnalise = computed(
    () => this.servico.lista().filter((o) => o.status === 'Em análise').length,
  );
  readonly emAndamento = computed(
    () => this.servico.lista().filter((o) => o.status === 'Em andamento').length,
  );
  readonly resolvidas = computed(
    () => this.servico.lista().filter((o) => o.status === 'Resolvida').length,
  );

  readonly porCategoria = computed(() => {
    const dados = this.servico.contar('categoriaId');
    const maximo = Math.max(1, ...dados.map((d) => d.total));
    return dados.map((d) => ({
      ...d,
      rotulo: this.categoriaService.nomePorId(Number(d.rotulo)),
      largura: (d.total / maximo) * 100,
    }));
  });

  readonly bairros = computed(() => this.servico.contar('bairro').map((b) => b.rotulo));

  readonly ocorrencias = computed(() =>
    this.servico.filtrar({
      categoriaId: this.categoriaId(),
      status: this.status(),
      prioridade: this.prioridade(),
      bairro: this.bairro(),
    }),
  );
}
