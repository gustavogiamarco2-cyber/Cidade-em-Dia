import { Injectable, computed, signal } from '@angular/core';
import { CategoriaDados } from './models';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly _lista = signal<CategoriaDados[]>([
    { id: 1, nome: 'Buraco', ativa: true },
    { id: 2, nome: 'Iluminação', ativa: true },
    { id: 3, nome: 'Descarte irregular', ativa: true },
    { id: 4, nome: 'Vazamento', ativa: true },
    { id: 5, nome: 'Sinalização danificada', ativa: true },
  ]);

  readonly lista = this._lista.asReadonly();
  readonly ativas = computed(() => this._lista().filter((c) => c.ativa));

  obter(id: number): CategoriaDados | undefined {
    return this._lista().find((categoria) => categoria.id === id);
  }

  nomePorId(id: number): string {
    return this.obter(id)?.nome ?? 'Categoria indisponível';
  }

  obterOuCriarLegada(nome: string): CategoriaDados {
    const nomeNormalizado = nome.trim();
    const existente = this._lista().find(
      (categoria) =>
        categoria.nome.trim().toLocaleLowerCase() === nomeNormalizado.toLocaleLowerCase(),
    );
    if (existente) return existente;

    const categoria: CategoriaDados = {
      id: Math.max(0, ...this._lista().map((item) => item.id)) + 1,
      nome: nomeNormalizado,
      ativa: false,
    };
    this._lista.update((lista) => [...lista, categoria]);
    return categoria;
  }

  adicionar(nome: string): void {
    this._lista.update((l) => [
      ...l,
      { id: Math.max(0, ...l.map((categoria) => categoria.id)) + 1, nome, ativa: true },
    ]);
  }

  renomear(id: number, nome: string): void {
    this._lista.update((l) => l.map((c) => (c.id === id ? { ...c, nome } : c)));
  }

  excluir(id: number): void {
    this._lista.update((l) => l.filter((c) => c.id !== id));
  }

  alternarSituacao(id: number): void {
    this._lista.update((l) => l.map((c) => (c.id === id ? { ...c, ativa: !c.ativa } : c)));
  }
}
