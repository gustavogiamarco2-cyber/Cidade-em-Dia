import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AutenticacaoService } from '../../compartilhado/autenticacao-service';
import { CategoriaService } from '../../compartilhado/categoria-service';
import { NIVEIS, NovaOcorrencia } from '../../compartilhado/models';
import { OcorrenciaService } from '../../compartilhado/ocorrencia-service';

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
  private readonly auth = inject(AutenticacaoService);

  readonly categorias = inject(CategoriaService).ativas;
  readonly niveis = NIVEIS;

  nomeFoto = '';

  dados: NovaOcorrencia = {
    categoriaId: this.categorias()[0]?.id ?? 0,
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
    const leitor = new FileReader();
    leitor.onload = () => {
      if (typeof leitor.result !== 'string') {
        this.snackBar.open('Não foi possível carregar a foto.', 'OK', { duration: 3000 });
        return;
      }
      this.nomeFoto = arquivo.name;
      this.dados.foto = leitor.result;
    };
    leitor.onerror = () => {
      this.snackBar.open('Não foi possível carregar a foto.', 'OK', { duration: 3000 });
    };
    leitor.readAsDataURL(arquivo);
  }

  registrar(): void {
    const usuarioId = this.auth.usuarioId();
    if (usuarioId === null) {
      this.snackBar.open('Não foi possível identificar o usuário da sessão.', 'OK', {
        duration: 3000,
      });
      return;
    }
    this.servico.registrar(this.dados, usuarioId);
    this.snackBar.open('Ocorrência registrada.', 'OK', { duration: 3000 });
    this.router.navigate(['/cidadao/minhas']);
  }

  cancelar(): void {
    this.router.navigate(['/cidadao/minhas']);
  }
}
