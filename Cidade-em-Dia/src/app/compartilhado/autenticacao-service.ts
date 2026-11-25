import { Injectable, inject, signal } from '@angular/core';
import { Perfil } from './models';
import { UsuarioService } from './usuario-service';

// Autenticação simulada: não há API. O perfil é deduzido do e-mail informado.
@Injectable({ providedIn: 'root' })
export class AutenticacaoService {
  private readonly usuarios = inject(UsuarioService);
  readonly perfil = signal<Perfil | null>(this.lerPerfil());
  readonly usuarioId = signal<number | null>(this.resolverUsuarioDaSessao());

  entrar(email: string): Perfil {
    const emailNormalizado = email.trim();
    const texto = emailNormalizado.toLowerCase();
    const perfil: Perfil = texto.includes('admin')
      ? 'admin'
      : texto.includes('atendente')
        ? 'atendente'
        : 'cidadao';
    const usuario =
      this.usuarios.obterPorEmail(emailNormalizado) ??
      this.usuarios.cadastrar({
        nome: emailNormalizado.split('@')[0] || 'Usuário',
        email: emailNormalizado,
        perfil: this.nomePerfil(perfil),
      });

    sessionStorage.setItem('perfil', perfil);
    sessionStorage.setItem('usuarioId', String(usuario.id));
    sessionStorage.setItem('email', emailNormalizado);
    this.perfil.set(perfil);
    this.usuarioId.set(usuario.id);
    return perfil;
  }

  sair(): void {
    sessionStorage.removeItem('perfil');
    sessionStorage.removeItem('usuarioId');
    sessionStorage.removeItem('email');
    this.perfil.set(null);
    this.usuarioId.set(null);
  }

  rotaInicial(perfil: Perfil): string {
    return {
      cidadao: '/cidadao/minhas',
      atendente: '/atendimento/painel',
      admin: '/gerenciamento/dashboard',
    }[perfil];
  }

  private lerPerfil(): Perfil | null {
    const perfil = sessionStorage.getItem('perfil');
    return perfil === 'cidadao' || perfil === 'atendente' || perfil === 'admin' ? perfil : null;
  }

  private resolverUsuarioDaSessao(): number | null {
    const usuarioId = Number(sessionStorage.getItem('usuarioId'));
    if (Number.isInteger(usuarioId) && usuarioId > 0 && this.usuarios.obter(usuarioId))
      return usuarioId;

    const email = sessionStorage.getItem('email');
    if (email) {
      const usuario = this.usuarios.obterPorEmail(email);
      if (usuario) {
        sessionStorage.setItem('usuarioId', String(usuario.id));
        return usuario.id;
      }
      const perfil = this.perfil();
      if (perfil) {
        return this.usuarios.cadastrar({
          nome: email.split('@')[0] || 'Usuário',
          email,
          perfil: this.nomePerfil(perfil),
        }).id;
      }
    }

    const perfil = this.perfil();
    const usuarioPadrao = perfil ? this.usuarios.obterPadrao(perfil) : undefined;
    if (usuarioPadrao) {
      sessionStorage.setItem('usuarioId', String(usuarioPadrao.id));
      return usuarioPadrao.id;
    }
    return null;
  }

  private nomePerfil(perfil: Perfil): string {
    return { cidadao: 'Cidadão', atendente: 'Atendente', admin: 'Administrador' }[perfil];
  }
}
