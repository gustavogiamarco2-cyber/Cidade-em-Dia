import { Component } from '@angular/core';

export interface UsuarioDados {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
}

@Component({
  selector: 'app-usuario',
  standalone: false,
  styleUrl: './usuario.scss',
  templateUrl: './usuario.html',
})
export class Usuario {
 
   colunasExibidas = [
    'nome',
    'email',
    'perfil',
    'situacao',
    'acao'
  ];

   usuarios: UsuarioDados[] = [
    {
      id: 1,
      nome: 'Ana Silva',
      email: 'ana@email.com',
      perfil: 'Cidadão',
      ativo: true
    },
    {
      id: 2,
      nome: 'Carlos Souza',
      email: 'carlos@email.com',
      perfil: 'Atendente',
      ativo: false
    }
  ];

  alternarSituacao(usuario: UsuarioDados): void {
    usuario.ativo = !usuario.ativo;
  }

}

