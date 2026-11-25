import { TestBed } from '@angular/core/testing';
import { AutenticacaoService } from './autenticacao-service';
import { UsuarioService } from './usuario-service';

describe('AutenticacaoService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('associa a sessão simulada a um usuário local sem alterar a regra de perfil', () => {
    const autenticacao = TestBed.inject(AutenticacaoService);
    const usuarios = TestBed.inject(UsuarioService);

    expect(autenticacao.entrar(' atendente@exemplo.com ')).toBe('atendente');

    const usuarioId = autenticacao.usuarioId();
    expect(usuarioId).not.toBeNull();
    expect(usuarios.obter(usuarioId!)).toMatchObject({
      email: 'atendente@exemplo.com',
      perfil: 'Atendente',
    });
    expect(sessionStorage.getItem('usuarioId')).toBe(String(usuarioId));
  });

  it('recupera um usuário padrão para sessões antigas sem identificador', () => {
    sessionStorage.setItem('perfil', 'atendente');
    const autenticacao = TestBed.inject(AutenticacaoService);

    expect(autenticacao.usuarioId()).toBe(2);
    expect(sessionStorage.getItem('usuarioId')).toBe('2');
  });
});
