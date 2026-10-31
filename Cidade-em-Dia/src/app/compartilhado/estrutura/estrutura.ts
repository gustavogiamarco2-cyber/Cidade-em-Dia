import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Perfil } from '../models';
import { ItemMenu } from '../menu-lateral/menu-lateral';

const MENUS: Record<Perfil, ItemMenu[]> = {
  cidadao: [
    { rotulo: 'Nova ocorrência', rota: '/cidadao/nova' },
    { rotulo: 'Minhas ocorrências', rota: '/cidadao/minhas' },
    { rotulo: 'Mapa', rota: '/cidadao/mapa' },
    { rotulo: 'Sair', rota: '/auth/login', sair: true },
  ],
  atendente: [
    { rotulo: 'Ocorrências', rota: '/atendimento/painel' },
    { rotulo: 'Sair', rota: '/auth/login', sair: true },
  ],
  admin: [
    { rotulo: 'Dashboard', rota: '/gerenciamento/dashboard' },
    { rotulo: 'Ocorrências', rota: '/gerenciamento/ocorrencias' },
    { rotulo: 'Usuários', rota: '/gerenciamento/usuario' },
    { rotulo: 'Categorias', rota: '/gerenciamento/categoria' },
    { rotulo: 'Estatísticas', rota: '/gerenciamento/estatisticas' },
    { rotulo: 'Sair', rota: '/auth/login', sair: true },
  ],
};

@Component({
  selector: 'app-estrutura',
  standalone: false,
  styleUrl: './estrutura.scss',
  templateUrl: './estrutura.html',
})
export class Estrutura {
  itens = MENUS[inject(ActivatedRoute).snapshot.data['perfil'] as Perfil];
}
