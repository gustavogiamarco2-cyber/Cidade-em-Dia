import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../../compartilhado/usuario-service';

@Component({
  selector: 'app-cadastro',
  standalone: false,
  styleUrl: '../autenticacao.scss',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private readonly usuarios = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  nome = '';
  email = '';
  senha = '';
  confirmacao = '';

  criar(): void {
    this.usuarios.cadastrar(this.nome.trim(), this.email.trim());
    this.snackBar.open('Conta criada. Faça login para continuar.', 'OK', { duration: 4000 });
    this.router.navigate(['/auth/login']);
  }
}
