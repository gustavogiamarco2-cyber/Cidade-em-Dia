import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaService } from '../../compartilhado/categoria-service';
import { CategoriaDados } from '../../compartilhado/models';
import { OcorrenciaService } from '../../compartilhado/ocorrencia-service';
import { CategoriaDialogo } from '../categoria-dialogo/categoria-dialogo';

@Component({
  selector: 'app-categoria',
  standalone: false,
  styleUrl: './categoria.scss',
  templateUrl: './categoria.html',
})
export class Categoria {
  private readonly servico = inject(CategoriaService);
  private readonly ocorrencias = inject(OcorrenciaService);
  private readonly dialogo = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  colunasExibidas = ['nome', 'situacao', 'acoes'];
  categorias = this.servico.lista;

  novaCategoria(): void {
    this.dialogo
      .open<CategoriaDialogo, { nome: string }, string>(CategoriaDialogo, { data: { nome: '' } })
      .afterClosed()
      .subscribe((nome) => nome && this.servico.adicionar(nome));
  }

  editarCategoria(categoria: CategoriaDados): void {
    this.dialogo
      .open<CategoriaDialogo, { nome: string }, string>(CategoriaDialogo, {
        data: { nome: categoria.nome },
      })
      .afterClosed()
      .subscribe((nome) => nome && this.servico.renomear(categoria.id, nome));
  }

  alternarSituacao(categoria: CategoriaDados): void {
    this.servico.alternarSituacao(categoria.id);
  }

  excluirCategoria(categoria: CategoriaDados): void {
    if (this.ocorrencias.usaCategoria(categoria.id)) {
      this.snackBar.open('Não é possível excluir uma categoria associada a ocorrências.', 'OK', {
        duration: 4000,
      });
      return;
    }
    if (!window.confirm(`Excluir a categoria "${categoria.nome}"?`)) return;
    this.servico.excluir(categoria.id);
    this.snackBar.open('Categoria excluída.', 'OK', { duration: 3000 });
  }
}
