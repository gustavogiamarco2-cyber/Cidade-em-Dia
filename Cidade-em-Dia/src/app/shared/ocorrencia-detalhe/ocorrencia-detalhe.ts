import { Component, computed, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OcorrenciaService } from '../ocorrencia-service';
import { STATUS, Status } from '../models';

@Component({
  selector: 'app-ocorrencia-detalhe',
  standalone: false,
  styleUrl: './ocorrencia-detalhe.scss',
  templateUrl: './ocorrencia-detalhe.html',
})
export class OcorrenciaDetalhe {
  private readonly servico = inject(OcorrenciaService);
  private readonly location = inject(Location);
  private readonly snackBar = inject(MatSnackBar);
  private readonly rota = inject(ActivatedRoute).snapshot;

  readonly gestao = this.rota.data['modo'] === 'gestao';
  readonly statusOpcoes = STATUS;

  private readonly id = Number(this.rota.paramMap.get('id'));
  readonly ocorrencia = computed(() => this.servico.obter(this.id));
  readonly novoStatus = signal<Status>(this.ocorrencia()?.status ?? 'Nova');

  atualizarStatus(): void {
    this.servico.atualizarStatus(this.id, this.novoStatus());
    this.snackBar.open('Status atualizado.', 'OK', { duration: 3000 });
  }

  confirmar(): void {
    this.servico.confirmar(this.id);
    this.snackBar.open('Ocorrência confirmada.', 'OK', { duration: 3000 });
  }

  voltar(): void {
    this.location.back();
  }
}
