import { Injectable, signal } from '@angular/core';
import { Perfil } from './models';

// Autenticação simulada: não há API. O perfil é deduzido do e-mail informado.
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly perfil = signal<Perfil | null>(sessionStorage.getItem('perfil') as Perfil | null);

  entrar(email: string): Perfil {
    const texto = email.toLowerCase();
    const perfil: Perfil = texto.includes('admin') ? 'admin' : texto.includes('atendente') ? 'atendente' : 'cidadao';
    sessionStorage.setItem('perfil', perfil);
    this.perfil.set(perfil);
    return perfil;
  }

  sair(): void {
    sessionStorage.removeItem('perfil');
    this.perfil.set(null);
  }

  rotaInicial(perfil: Perfil): string {
    return { cidadao: '/cidadao/minhas', atendente: '/atendimento/painel', admin: '/gerenciamento/dashboard' }[perfil];
  }
}
