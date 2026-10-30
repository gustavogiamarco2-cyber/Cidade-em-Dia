import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SharedModule } from '../shared/shared-module';
import { GerenciamentoRoutingModule } from './gerenciamento-routing-module';
import { Categoria } from './categoria/categoria';
import { CategoriaDialogo } from './categoria-dialogo/categoria-dialogo';
import { Usuario } from './usuario/usuario';
import { Dashboard } from './dashboard/dashboard';
import { Ocorrencias } from './ocorrencias/ocorrencias';
import { Estatisticas } from './estatisticas/estatisticas';

@NgModule({
  declarations: [Categoria, CategoriaDialogo, Usuario, Dashboard, Ocorrencias, Estatisticas],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    GerenciamentoRoutingModule,
    SharedModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
})
export class GerenciamentoModule {}
