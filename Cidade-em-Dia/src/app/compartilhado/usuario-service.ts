import { Injectable, signal } from '@angular/core';
import { Perfil, UsuarioDados } from './models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly _lista = signal<UsuarioDados[]>([
    { id: 1, nome: 'Maria Souza', email: 'maria@exemplo.com', perfil: 'Cidadão', ativo: true },
    { id: 2, nome: 'João Pereira', email: 'joao@exemplo.com', perfil: 'Atendente', ativo: true },
    { id: 3, nome: 'Ana Lima', email: 'ana@exemplo.com', perfil: 'Cidadão', ativo: false },
    {
      id: 4,
      nome: 'Administrador',
      email: 'admin@exemplo.com',
      perfil: 'Administrador',
      ativo: true,
    },
  ]);

  readonly lista = this._lista.asReadonly();

  obter(id: number): UsuarioDados | undefined {
    return this._lista().find((usuario) => usuario.id === id);
  }

  obterPorEmail(email: string): UsuarioDados | undefined {
    const emailNormalizado = email.trim().toLowerCase();
    return this._lista().find((usuario) => usuario.email.toLowerCase() === emailNormalizado);
  }

  obterPadrao(perfil: Perfil): UsuarioDados | undefined {
    const perfilUsuario = {
      cidadao: 'Cidadão',
      atendente: 'Atendente',
      admin: 'Administrador',
    }[perfil];
    return this._lista().find((usuario) => usuario.perfil === perfilUsuario);
  }

  cadastrar(dados: Pick<UsuarioDados, 'nome' | 'email' | 'perfil'>): UsuarioDados {
    const usuario: UsuarioDados = {
      ...dados,
      id: Math.max(0, ...this._lista().map((item) => item.id)) + 1,
      ativo: true,
    };
    this._lista.update((lista) => [...lista, usuario]);
    return usuario;
  }

  atualizar(id: number, dados: Pick<UsuarioDados, 'nome' | 'email' | 'perfil'>): void {
    this._lista.update((lista) =>
      lista.map((usuario) => (usuario.id === id ? { ...usuario, ...dados } : usuario)),
    );
  }

  excluir(id: number): void {
    this._lista.update((lista) => lista.filter((usuario) => usuario.id !== id));
  }

  alternarSituacao(id: number): void {
    this._lista.update((l) => l.map((u) => (u.id === id ? { ...u, ativo: !u.ativo } : u)));
  }
}
