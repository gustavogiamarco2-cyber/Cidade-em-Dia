import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MenuLateral } from './menu-lateral/menu-lateral';
import { Layout } from './layout/layout';
import { OcorrenciaDetalhe } from './ocorrencia-detalhe/ocorrencia-detalhe';

@NgModule({
  declarations: [MenuLateral, Layout, OcorrenciaDetalhe],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  exports: [MenuLateral, Layout, OcorrenciaDetalhe],
})
export class SharedModule {}
