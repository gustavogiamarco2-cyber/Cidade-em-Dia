import { Component } from '@angular/core';

export interface CategoriaDados {
  id: number;
  nome: string;
  ativa: boolean;
}

@Component({
  selector: 'app-categoria',
  standalone: false,
  styleUrl: './categoria.scss',
  templateUrl: './categoria.html',
})
export class Categoria {

  colunasExibidas = ['nome', 'situacao', 'acoes'];

  categorias: CategoriaDados[] = [
    { id: 1, nome: 'Buraco', ativa: true },
    { id: 2, nome: 'Iluminação pública', ativa: true },
    { id: 3, nome: 'Limpeza urbana', ativa: false },
    { id: 4, nome: 'Sinalização', ativa: true },
  ];

  novaCategoria(): void {
    const nome = prompt('Digite o nome da nova categoria:');

    if (nome && nome.trim()) {
      this.categorias = [...this.categorias, {
        id: Date.now(),
        nome: nome.trim(),
        ativa: true,
      }];
    }
  }

  editarCategoria(categoria: CategoriaDados): void {
    const nome = prompt('Digite o novo nome:', categoria.nome);

    if (nome && nome.trim()) {
      this.categorias = this.categorias.map(item =>
        item.id === categoria.id
          ? { ...item, nome: nome.trim() }
          : item,
      );
    }
  }

  alternarSituacao(categoria: CategoriaDados): void {
    this.categorias = this.categorias.map(item =>
      item.id === categoria.id
        ? { ...item, ativa: !item.ativa }
        : item,
    );
  }
}
