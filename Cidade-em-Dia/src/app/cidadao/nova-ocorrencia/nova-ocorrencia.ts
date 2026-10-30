import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaService } from '../../shared/categoria-service';
import { NIVEIS, NovaOcorrencia } from '../../shared/models';
import { OcorrenciaService } from '../../shared/ocorrencia-service';

@Component({
  selector: 'app-nova-ocorrencia',
  standalone: false,
  styleUrl: './nova-ocorrencia.scss',
  templateUrl: './nova-ocorrencia.html',
})
export class NovaOcorrenciaPagina {
  private readonly servico = inject(OcorrenciaService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly categorias = inject(CategoriaService).ativas;
  readonly niveis = NIVEIS;

  nomeFoto = '';

  dados: NovaOcorrencia = {
    categoria: this.categorias()[0]?.nome ?? '',
    descricao: '',
    urgencia: 'Baixa',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    referencia: '',
    foto: undefined,
  };

  selecionarFoto(evento: Event): void {
    const arquivo = (evento.target as HTMLInputElement).files?.[0];
    if (!arquivo || !arquivo.type.startsWith('image/')) return;
    this.nomeFoto = arquivo.name;
    this.dados.foto = URL.createObjectURL(arquivo);
  }

  registrar(): void {
    this.servico.registrar(this.dados);
    this.snackBar.open('Ocorrência registrada.', 'OK', { duration: 3000 });
    this.router.navigate(['/cidadao/minhas']);
  }

  cancelar(): void {
    this.router.navigate(['/cidadao/minhas']);
  }
}
