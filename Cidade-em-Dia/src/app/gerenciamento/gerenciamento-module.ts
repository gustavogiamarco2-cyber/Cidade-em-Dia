import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { GerenciamentoRoutingModule } from './gerenciamento-routing-module';
import { Categoria } from './categoria/categoria';
import { Usuario } from './usuario/usuario';
import { MenuLateral } from './menu-lateral/menu-lateral';

@NgModule({
  declarations: [Categoria, Usuario, MenuLateral],
  imports: [CommonModule, GerenciamentoRoutingModule, MatTableModule, MatButtonModule],
})
export class GerenciamentoModule {}
