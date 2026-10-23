import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'telas/inicial',
    pathMatch: 'full',
  },
  {
    path: 'telas',
    loadChildren: () => import('./telas/telas-module').then(m => m.TelasModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
