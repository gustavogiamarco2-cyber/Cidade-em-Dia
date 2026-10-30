import { Injectable, signal } from '@angular/core';
import { UsuarioDados } from './models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly _lista = signal<UsuarioDados[]>([
    { id: 1, nome: 'Maria Souza', email: 'maria@exemplo.com', perfil: 'Cidadão', ativo: true },
    { id: 2, nome: 'João Pereira', email: 'joao@exemplo.com', perfil: 'Atendente', ativo: true },
    { id: 3, nome: 'Ana Lima', email: 'ana@exemplo.com', perfil: 'Cidadão', ativo: false },
  ]);

  readonly lista = this._lista.asReadonly();

  cadastrar(nome: string, email: string): void {
    this._lista.update(l => [...l, { id: Date.now(), nome, email, perfil: 'Cidadão', ativo: true }]);
  }

  alternarSituacao(id: number): void {
    this._lista.update(l => l.map(u => (u.id === id ? { ...u, ativo: !u.ativo } : u)));
  }
}
