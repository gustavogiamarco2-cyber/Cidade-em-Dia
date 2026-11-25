import { TestBed } from '@angular/core/testing';
import { UsuarioService } from './usuario-service';

describe('UsuarioService', () => {
  let servico: UsuarioService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    servico = TestBed.inject(UsuarioService);
  });

  it('cadastra, atualiza e exclui usuários', () => {
    servico.cadastrar({ nome: 'Carlos Silva', email: 'carlos@exemplo.com', perfil: 'Atendente' });
    const criado = servico.lista().at(-1)!;

    expect(criado).toMatchObject({
      nome: 'Carlos Silva',
      email: 'carlos@exemplo.com',
      perfil: 'Atendente',
      ativo: true,
    });

    servico.alternarSituacao(criado.id);
    servico.atualizar(criado.id, {
      nome: 'Carlos Souza',
      email: 'carlos.souza@exemplo.com',
      perfil: 'Administrador',
    });
    expect(servico.lista().at(-1)).toMatchObject({
      nome: 'Carlos Souza',
      email: 'carlos.souza@exemplo.com',
      perfil: 'Administrador',
      ativo: false,
    });

    servico.excluir(criado.id);
    expect(servico.lista().some((usuario) => usuario.id === criado.id)).toBe(false);
  });
});
