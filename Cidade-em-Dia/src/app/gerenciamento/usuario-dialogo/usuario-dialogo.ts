import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioDados } from '../../compartilhado/models';

type DadosFormularioUsuario = Pick<UsuarioDados, 'nome' | 'email' | 'perfil'>;

@Component({
  selector: 'app-usuario-dialogo',
  standalone: false,
  template: `
    <h2 mat-dialog-title>{{ dados.usuario ? 'Editar usuário' : 'Novo usuário' }}</h2>
    <form #formulario="ngForm" (ngSubmit)="salvar()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Nome</mat-label>
          <input matInput name="nome" required [(ngModel)]="nome" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>E-mail</mat-label>
          <input matInput type="email" name="email" required [(ngModel)]="email" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Perfil</mat-label>
          <mat-select name="perfil" required [(ngModel)]="perfil">
            @for (opcao of perfis; track opcao) {
              <mat-option [value]="opcao">{{ opcao }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancelar</button>
        <button mat-flat-button type="submit" [disabled]="formulario.invalid">Salvar</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: '.campo { width: 100%; }',
})
export class UsuarioDialogo {
  private readonly ref = inject(MatDialogRef<UsuarioDialogo, DadosFormularioUsuario>);
  readonly dados = inject<{ usuario?: UsuarioDados }>(MAT_DIALOG_DATA);
  readonly perfis = ['Cidadão', 'Atendente', 'Administrador'];

  nome = this.dados.usuario?.nome ?? '';
  email = this.dados.usuario?.email ?? '';
  perfil = this.dados.usuario?.perfil ?? 'Cidadão';

  salvar(): void {
    const nome = this.nome.trim();
    const email = this.email.trim();
    if (!nome || !email || !this.perfil) return;

    this.ref.close({ nome, email, perfil: this.perfil });
  }
}
