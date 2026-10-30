import { Component, computed, inject, signal } from '@angular/core';
import { OcorrenciaService } from '../../shared/ocorrencia-service';

@Component({
  selector: 'app-mapa',
  standalone: false,
  styleUrl: './mapa.scss',
  templateUrl: './mapa.html',
})
export class Mapa {
  private readonly servico = inject(OcorrenciaService);

  readonly ocorrencias = this.servico.lista;
  readonly selecionadaId = signal<number | null>(null);
  readonly selecionada = computed(() => this.servico.obter(this.selecionadaId() ?? -1));

  // Sem serviço de geocodificação: posição ilustrativa derivada do id.
  esquerda(id: number): number {
    return 8 + ((id * 37) % 84);
  }

  topo(id: number): number {
    return 8 + ((id * 53) % 80);
  }
}
