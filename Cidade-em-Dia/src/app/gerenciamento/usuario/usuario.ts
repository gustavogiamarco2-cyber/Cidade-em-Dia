import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../compartilhado/usuario-service';
import { UsuarioDados } from '../../compartilhado/models';

@Component({
  selector: 'app-usuario',
  standalone: false,
  styleUrl: './usuario.scss',
  templateUrl: './usuario.html',
})
export class Usuario {
  private readonly servico = inject(UsuarioService);

  colunasExibidas = ['nome', 'email', 'perfil', 'situacao', 'acao'];
  usuarios = this.servico.lista;

  alternarSituacao(usuario: UsuarioDados): void {
    this.servico.alternarSituacao(usuario.id);
  }
}
