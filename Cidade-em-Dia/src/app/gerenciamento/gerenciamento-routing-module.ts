import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Categoria } from './categoria/categoria';
import { Usuario } from './usuario/usuario';

const routes: Routes = [
  { path: 'categoria', component: Categoria },
  { path: 'usuario', component: Usuario },
  { path: '', redirectTo: 'usuario', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GerenciamentoRoutingModule {}
