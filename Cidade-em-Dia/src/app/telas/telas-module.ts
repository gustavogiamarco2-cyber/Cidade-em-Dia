import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelasRoutingModule } from './telas-routing-module';
import { Inicial } from './inicial/inicial';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [Inicial],
  imports: [CommonModule, TelasRoutingModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
})
export class TelasModule {
}
