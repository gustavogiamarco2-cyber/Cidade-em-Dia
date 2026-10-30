import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./autenticacao/autenticacao-module').then(m => m.AutenticacaoModule),
  },
  {
    path: 'cidadao',
    loadChildren: () => import('./cidadao/cidadao-module').then(m => m.CidadaoModule),
  },
  {
    path: 'atendimento',
    loadChildren: () => import('./atendimento/atendimento-module').then(m => m.AtendimentoModule),
  },
  {
    path: 'telas',
    loadChildren: () => import('./telas/telas-module').then(m => m.TelasModule),
  },
  {
    path: 'gerenciamento',
    loadChildren: () => import('./gerenciamento/gerenciamento-module').then(m => m.GerenciamentoModule),
  },
  { path: '**', redirectTo: 'auth/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
