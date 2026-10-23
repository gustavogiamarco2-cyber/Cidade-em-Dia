import { Component } from '@angular/core';

@Component({
  selector: 'app-inicial',
  standalone: false,
  styleUrl: './inicial.scss',
  templateUrl: './inicial.html',
   template: `<p>Telas funcionando!</p>`
})
export class Inicial {

  nome = '';
  descricao = '';
  mensagem = '';

  salvar(): void {
    if (!this.nome.trim()) return;
    this.mensagem = `Projeto "${this.nome.trim()}" validado!`;
  }
    limpar(): void {
      this.nome = '';
      this.descricao = '';
      this.mensagem = '';
    }
}
