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
  readonly ativas = computed(() => this._lista().filter(c => c.ativa));

  adicionar(nome: string): void {
    this._lista.update(l => [...l, { id: Date.now(), nome, ativa: true }]);
  }

  renomear(id: number, nome: string): void {
    this._lista.update(l => l.map(c => (c.id === id ? { ...c, nome } : c)));
  }

  alternarSituacao(id: number): void {
    this._lista.update(l => l.map(c => (c.id === id ? { ...c, ativa: !c.ativa } : c)));
  }
}
