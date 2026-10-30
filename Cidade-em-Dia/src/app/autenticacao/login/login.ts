import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth-service';

@Component({
  selector: 'app-login',
  standalone: false,
  styleUrl: '../autenticacao.scss',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  senha = '';

  entrar(): void {
    const perfil = this.auth.entrar(this.email.trim());
    this.router.navigateByUrl(this.auth.rotaInicial(perfil));
  }
}
