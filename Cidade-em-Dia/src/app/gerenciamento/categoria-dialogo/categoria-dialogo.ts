import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-categoria-dialogo',
  standalone: false,
  template: `
    <h2 mat-dialog-title>{{ dados.nome ? 'Editar categoria' : 'Nova categoria' }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="campo">
        <mat-label>Nome da categoria</mat-label>
        <input matInput name="nome" required [(ngModel)]="nome" (keydown.enter)="salvar()" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" mat-dialog-close>Cancelar</button>
      <button mat-flat-button type="button" [disabled]="!nome.trim()" (click)="salvar()">Salvar</button>
    </mat-dialog-actions>
  `,
  styles: '.campo { width: 100%; min-width: 280px; }',
})
export class CategoriaDialogo {
  private readonly ref = inject(MatDialogRef<CategoriaDialogo, string>);
  readonly dados = inject<{ nome: string }>(MAT_DIALOG_DATA);

  nome = this.dados.nome;

  salvar(): void {
    if (this.nome.trim()) this.ref.close(this.nome.trim());
  }
}
