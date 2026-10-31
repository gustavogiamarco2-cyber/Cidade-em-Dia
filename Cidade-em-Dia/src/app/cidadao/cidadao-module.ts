import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ModuloCompartilhado } from '../compartilhado/modulo-compartilhado';
import { Estrutura } from '../compartilhado/estrutura/estrutura';
import { OcorrenciaDetalhe } from '../compartilhado/ocorrencia-detalhe/ocorrencia-detalhe';
import { perfilGuard } from '../compartilhado/perfil-guard';
import { MinhasOcorrencias } from './minhas-ocorrencias/minhas-ocorrencias';
import { NovaOcorrenciaPagina } from './nova-ocorrencia/nova-ocorrencia';
import { Mapa } from './mapa/mapa';

const routes: Routes = [
  {
    path: '',
    component: Estrutura,
    canActivate: [perfilGuard],
    data: { perfil: 'cidadao' },
    children: [
      { path: 'minhas', component: MinhasOcorrencias },
      { path: 'nova', component: NovaOcorrenciaPagina },
      { path: 'mapa', component: Mapa },
      { path: 'ocorrencia/:id', component: OcorrenciaDetalhe, data: { modo: 'cidadao' } },
      { path: '', redirectTo: 'minhas', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  declarations: [MinhasOcorrencias, NovaOcorrenciaPagina, Mapa],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ModuloCompartilhado,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
})
export class CidadaoModule {}
