import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../compartilhado/autenticacao-service';

@Component({
  selector: 'app-entrar',
  standalone: false,
  styleUrl: '../autenticacao.scss',
  templateUrl: './entrar.html',
})
export class Entrar {
  private readonly auth = inject(AutenticacaoService);
  private readonly router = inject(Router);

  email = '';
  senha = '';

  entrar(): void {
    const perfil = this.auth.entrar(this.email.trim());
    this.router.navigateByUrl(this.auth.rotaInicial(perfil));
  }
}
