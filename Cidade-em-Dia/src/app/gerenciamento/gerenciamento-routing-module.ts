import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Estrutura } from '../compartilhado/estrutura/estrutura';
import { OcorrenciaDetalhe } from '../compartilhado/ocorrencia-detalhe/ocorrencia-detalhe';
import { perfilGuard } from '../compartilhado/perfil-guard';
import { Categoria } from './categoria/categoria';
import { Usuario } from './usuario/usuario';
import { Painel } from './painel/painel';
import { Ocorrencias } from './ocorrencias/ocorrencias';
import { Estatisticas } from './estatisticas/estatisticas';

const routes: Routes = [
  {
    path: '',
    component: Estrutura,
    canActivate: [perfilGuard],
    data: { perfil: 'admin' },
    children: [
      { path: 'dashboard', component: Painel },
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
