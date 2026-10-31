import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Entrar } from './entrar/entrar';
import { Cadastro } from './cadastro/cadastro';

const routes: Routes = [
  { path: 'login', component: Entrar },
  { path: 'cadastro', component: Cadastro },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  declarations: [Entrar, Cadastro],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
})
export class AutenticacaoModule {}
