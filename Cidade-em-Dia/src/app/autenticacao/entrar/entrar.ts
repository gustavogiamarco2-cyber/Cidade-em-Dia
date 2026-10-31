import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../compartilhado/auth-service';

@Component({
  selector: 'app-entrar',
  standalone: false,
  styleUrl: '../autenticacao.scss',
  templateUrl: './entrar.html',
})
export class Entrar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  senha = '';

  entrar(): void {
    const perfil = this.auth.entrar(this.email.trim());
    this.router.navigateByUrl(this.auth.rotaInicial(perfil));
  }
}
