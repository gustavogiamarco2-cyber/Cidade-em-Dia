import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelasRoutingModule } from './telas-routing-module';
import { Inicial } from './inicial/inicial';

@NgModule({
  declarations: [Inicial],
  imports: [CommonModule, TelasRoutingModule],
})
export class TelasModule {
}
