import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Inicial } from './inicial/inicial';

const routes: Routes = [
  {
  path: 'inicial',
  component: Inicial,
  
 },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TelasRoutingModule {}
