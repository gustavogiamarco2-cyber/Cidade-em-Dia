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

  cadastrar(dados: Pick<UsuarioDados, 'nome' | 'email' | 'perfil'>): void {
    this._lista.update(lista => [
      ...lista,
      {
        ...dados,
        id: Math.max(0, ...lista.map(usuario => usuario.id)) + 1,
        ativo: true,
      },
    ]);
  }

  atualizar(id: number, dados: Pick<UsuarioDados, 'nome' | 'email' | 'perfil'>): void {
    this._lista.update(lista =>
      lista.map(usuario => (usuario.id === id ? { ...usuario, ...dados } : usuario)),
    );
  }

  excluir(id: number): void {
    this._lista.update(lista => lista.filter(usuario => usuario.id !== id));
  }

  alternarSituacao(id: number): void {
    this._lista.update(l => l.map(u => (u.id === id ? { ...u, ativo: !u.ativo } : u)));
  }
}
