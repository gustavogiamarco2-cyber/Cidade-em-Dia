import { Component, inject, input } from '@angular/core';
import { AutenticacaoService } from '../autenticacao-service';

export interface ItemMenu {
  rotulo: string;
  rota: string;
  sair?: boolean;
}

@Component({
  selector: 'app-menu-lateral',
  standalone: false,
  styleUrl: './menu-lateral.scss',
  templateUrl: './menu-lateral.html',
})
export class MenuLateral {
  private readonly auth = inject(AutenticacaoService);

  itens = input.required<ItemMenu[]>();

  clicar(item: ItemMenu): void {
    if (item.sair) this.auth.sair();
  }
}
