import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaService } from '../../compartilhado/categoria-service';
import { CategoriaDados } from '../../compartilhado/models';
import { CategoriaDialogo } from '../categoria-dialogo/categoria-dialogo';

@Component({
  selector: 'app-categoria',
  standalone: false,
  styleUrl: './categoria.scss',
  templateUrl: './categoria.html',
})
export class Categoria {
  private readonly servico = inject(CategoriaService);
  private readonly dialogo = inject(MatDialog);

  colunasExibidas = ['nome', 'situacao', 'acoes'];
  categorias = this.servico.lista;

  novaCategoria(): void {
    this.dialogo
      .open<CategoriaDialogo, { nome: string }, string>(CategoriaDialogo, { data: { nome: '' } })
      .afterClosed()
      .subscribe(nome => nome && this.servico.adicionar(nome));
  }

  editarCategoria(categoria: CategoriaDados): void {
    this.dialogo
      .open<CategoriaDialogo, { nome: string }, string>(CategoriaDialogo, { data: { nome: categoria.nome } })
      .afterClosed()
      .subscribe(nome => nome && this.servico.renomear(categoria.id, nome));
  }

  alternarSituacao(categoria: CategoriaDados): void {
    this.servico.alternarSituacao(categoria.id);
  }
}
