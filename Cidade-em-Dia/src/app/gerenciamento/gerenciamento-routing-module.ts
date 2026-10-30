import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from '../shared/layout/layout';
import { OcorrenciaDetalhe } from '../shared/ocorrencia-detalhe/ocorrencia-detalhe';
import { perfilGuard } from '../shared/perfil-guard';
import { Categoria } from './categoria/categoria';
import { Usuario } from './usuario/usuario';
import { Dashboard } from './dashboard/dashboard';
import { Ocorrencias } from './ocorrencias/ocorrencias';
import { Estatisticas } from './estatisticas/estatisticas';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [perfilGuard],
    data: { perfil: 'admin' },
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'ocorrencias', component: Ocorrencias },
      { path: 'ocorrencia/:id', component: OcorrenciaDetalhe, data: { modo: 'gestao' } },
      { path: 'usuario', component: Usuario },
      { path: 'categoria', component: Categoria },
      { path: 'estatisticas', component: Estatisticas },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GerenciamentoRoutingModule {}
