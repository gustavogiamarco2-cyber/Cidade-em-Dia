import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ModuloCompartilhado } from '../compartilhado/modulo-compartilhado';
import { Estrutura } from '../compartilhado/estrutura/estrutura';
import { OcorrenciaDetalhe } from '../compartilhado/ocorrencia-detalhe/ocorrencia-detalhe';
import { perfilGuard } from '../compartilhado/perfil-guard';
import { Painel } from './painel/painel';

const routes: Routes = [
  {
    path: '',
    component: Estrutura,
    canActivate: [perfilGuard],
    data: { perfil: 'atendente' },
    children: [
      { path: 'painel', component: Painel },
      { path: 'ocorrencia/:id', component: OcorrenciaDetalhe, data: { modo: 'gestao' } },
      { path: '', redirectTo: 'painel', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  declarations: [Painel],
  imports: [CommonModule, RouterModule.forChild(routes), ModuloCompartilhado, MatButtonModule, MatCardModule],
})
export class AtendimentoModule {}
