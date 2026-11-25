import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CategoriaDados,
  Nivel,
  NIVEIS,
  NovaOcorrencia,
  Ocorrencia,
} from '../../compartilhado/models';

@Component({
  selector: 'app-ocorrencia-dialogo',
  standalone: false,
  template: `
    <h2 mat-dialog-title>{{ dados.ocorrencia ? 'Editar ocorrência' : 'Nova ocorrência' }}</h2>
    <form #formulario="ngForm" (ngSubmit)="salvar()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Categoria</mat-label>
          <mat-select name="categoriaId" required [(ngModel)]="formularioDados.categoriaId">
            @for (categoria of dados.categorias; track categoria.id) {
              <mat-option [value]="categoria.id">{{ categoria.nome }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Descrição</mat-label>
          <textarea
            matInput
            name="descricao"
            rows="3"
            required
            [(ngModel)]="formularioDados.descricao"
          ></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Urgência</mat-label>
          <mat-select name="urgencia" required [(ngModel)]="formularioDados.urgencia">
            @for (nivel of niveis; track nivel) {
              <mat-option [value]="nivel">{{ nivel }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Rua</mat-label>
          <input matInput name="rua" required [(ngModel)]="formularioDados.rua" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Número</mat-label>
          <input matInput name="numero" required [(ngModel)]="formularioDados.numero" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Bairro</mat-label>
          <input matInput name="bairro" required [(ngModel)]="formularioDados.bairro" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Cidade</mat-label>
          <input matInput name="cidade" required [(ngModel)]="formularioDados.cidade" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="campo">
          <mat-label>Ponto de referência (opcional)</mat-label>
          <input matInput name="referencia" [(ngModel)]="formularioDados.referencia" />
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
export class OcorrenciaDialogo {
  private readonly ref = inject(MatDialogRef<OcorrenciaDialogo, NovaOcorrencia>);
  readonly dados = inject<{ categorias: CategoriaDados[]; ocorrencia?: Ocorrencia }>(
    MAT_DIALOG_DATA,
  );
  readonly niveis = NIVEIS;

  formularioDados: NovaOcorrencia = this.dados.ocorrencia
    ? {
        categoriaId: this.dados.ocorrencia.categoriaId,
        descricao: this.dados.ocorrencia.descricao,
        urgencia: this.dados.ocorrencia.urgencia,
        rua: this.dados.ocorrencia.rua,
        numero: this.dados.ocorrencia.numero,
        bairro: this.dados.ocorrencia.bairro,
        cidade: this.dados.ocorrencia.cidade,
        referencia: this.dados.ocorrencia.referencia,
        foto: this.dados.ocorrencia.foto,
      }
    : {
        categoriaId: this.dados.categorias[0]?.id ?? 0,
        descricao: '',
        urgencia: 'Baixa' satisfies Nivel,
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        referencia: '',
      };

  salvar(): void {
    const dados = {
      ...this.formularioDados,
      descricao: this.formularioDados.descricao.trim(),
      rua: this.formularioDados.rua.trim(),
      numero: this.formularioDados.numero.trim(),
      bairro: this.formularioDados.bairro.trim(),
      cidade: this.formularioDados.cidade.trim(),
      referencia: this.formularioDados.referencia.trim(),
    };
    if (
      !dados.categoriaId ||
      !dados.descricao ||
      !dados.rua ||
      !dados.numero ||
      !dados.bairro ||
      !dados.cidade
    )
      return;

    this.ref.close(dados);
  }
}
