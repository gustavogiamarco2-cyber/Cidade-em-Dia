import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MenuLateral } from './menu-lateral/menu-lateral';
import { Estrutura } from './estrutura/estrutura';
import { OcorrenciaDetalhe } from './ocorrencia-detalhe/ocorrencia-detalhe';

@NgModule({
  declarations: [MenuLateral, Estrutura, OcorrenciaDetalhe],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  exports: [MenuLateral, Estrutura, OcorrenciaDetalhe],
})
export class ModuloCompartilhado {}
