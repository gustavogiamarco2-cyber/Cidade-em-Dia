import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AtendimentoService } from '../../compartilhado/atendimento-service';
import { AutenticacaoService } from '../../compartilhado/autenticacao-service';
import { OcorrenciaService } from '../../compartilhado/ocorrencia-service';
import { UsuarioService } from '../../compartilhado/usuario-service';
import { UsuarioDados } from '../../compartilhado/models';
import { UsuarioDialogo } from '../usuario-dialogo/usuario-dialogo';

@Component({
  selector: 'app-usuario',
  standalone: false,
  styleUrl: './usuario.scss',
  templateUrl: './usuario.html',
})
export class Usuario {
  private readonly servico = inject(UsuarioService);
  private readonly ocorrencias = inject(OcorrenciaService);
  private readonly atendimentos = inject(AtendimentoService);
  private readonly auth = inject(AutenticacaoService);
  private readonly dialogo = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  colunasExibidas = ['nome', 'email', 'perfil', 'situacao', 'acoes'];
  usuarios = this.servico.lista;

  novoUsuario(): void {
    this.dialogo
      .open(UsuarioDialogo, { data: {} })
      .afterClosed()
      .subscribe((dados) => {
        if (!dados) return;
        this.servico.cadastrar(dados);
        this.snackBar.open('Usuário cadastrado.', 'OK', { duration: 3000 });
      });
  }

  editarUsuario(usuario: UsuarioDados): void {
    this.dialogo
      .open(UsuarioDialogo, { data: { usuario } })
      .afterClosed()
      .subscribe((dados) => {
        if (!dados) return;
        this.servico.atualizar(usuario.id, dados);
        this.snackBar.open('Usuário atualizado.', 'OK', { duration: 3000 });
      });
  }

  alternarSituacao(usuario: UsuarioDados): void {
    this.servico.alternarSituacao(usuario.id);
  }

  excluirUsuario(usuario: UsuarioDados): void {
    if (
      this.auth.usuarioId() === usuario.id ||
      this.ocorrencias.usaUsuario(usuario.id) ||
      this.atendimentos.possuiRegistrosDoUsuario(usuario.id)
    ) {
      this.snackBar.open(
        'Não é possível excluir um usuário ativo na sessão ou relacionado a ocorrências/atendimentos.',
        'OK',
        { duration: 4000 },
      );
      return;
    }
    if (!window.confirm(`Excluir o usuário ${usuario.nome}?`)) return;
    this.servico.excluir(usuario.id);
    this.snackBar.open('Usuário excluído.', 'OK', { duration: 3000 });
  }
}
