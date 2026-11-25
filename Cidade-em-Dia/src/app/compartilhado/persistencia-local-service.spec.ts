import { TestBed } from '@angular/core/testing';
import { AtendimentoService } from './atendimento-service';
import { CategoriaService } from './categoria-service';
import { CHAVES_PERSISTENCIA } from './persistencia-local-service';
import { OcorrenciaService } from './ocorrencia-service';
import { UsuarioService } from './usuario-service';

describe('Persistência local das entidades', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
  });

  it('restaura alterações das quatro entidades após recriar os serviços', () => {
    const usuarios = TestBed.inject(UsuarioService);
    const categorias = TestBed.inject(CategoriaService);
    const ocorrencias = TestBed.inject(OcorrenciaService);
    const atendimentos = TestBed.inject(AtendimentoService);

    usuarios.cadastrar({ nome: 'Carlos Silva', email: 'carlos@exemplo.com', perfil: 'Cidadão' });
    const categoria = categorias.lista().find((item) => item.id === 1)!;
    categorias.renomear(categoria.id, 'Buracos na via');
    const ocorrencia = ocorrencias.registrar(
      {
        categoriaId: categoria.id,
        descricao: 'Buraco novo.',
        urgencia: 'Alta',
        rua: 'Rua Nova',
        numero: '10',
        bairro: 'Centro',
        cidade: 'Curitiba',
        referencia: '',
      },
      5,
    );
    ocorrencias.atualizarStatus(ocorrencia.id, 'Em análise', 2);
    const totalAtendimentos = atendimentos.lista().length;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    const usuariosRestaurados = TestBed.inject(UsuarioService);
    const categoriasRestauradas = TestBed.inject(CategoriaService);
    const ocorrenciasRestauradas = TestBed.inject(OcorrenciaService);
    const atendimentosRestaurados = TestBed.inject(AtendimentoService);

    expect(usuariosRestaurados.obterPorEmail('carlos@exemplo.com')).toMatchObject({ id: 5 });
    expect(categoriasRestauradas.nomePorId(categoria.id)).toBe('Buracos na via');
    expect(ocorrenciasRestauradas.obter(ocorrencia.id)).toMatchObject({
      categoriaId: categoria.id,
      usuarioId: 5,
      status: 'Em análise',
    });
    expect(atendimentosRestaurados.lista()).toHaveLength(totalAtendimentos);
    expect(atendimentosRestaurados.lista().at(-1)).toMatchObject({
      ocorrenciaId: ocorrencia.id,
      usuarioId: 2,
      statusAnterior: 'Nova',
      statusNovo: 'Em análise',
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    expect(TestBed.inject(AtendimentoService).lista()).toHaveLength(totalAtendimentos);
  });

  it('recupera registros antigos ou incompletos e mantém IDs relacionais válidos', () => {
    localStorage.setItem(
      CHAVES_PERSISTENCIA.usuarios,
      JSON.stringify([{ id: 7, nome: 'Usuário antigo', email: 'antigo@exemplo.com' }]),
    );
    localStorage.setItem(CHAVES_PERSISTENCIA.categorias, JSON.stringify([{ id: 9, nome: 'Rua' }]));
    localStorage.setItem(
      CHAVES_PERSISTENCIA.ocorrencias,
      JSON.stringify([
        {
          id: 13,
          titulo: 'Ocorrência antiga',
          categoria: 'Iluminação antiga',
          descricao: 'Registro legado',
          rua: 'Rua Antiga',
          status: 'Nova',
        },
      ]),
    );
    localStorage.setItem(
      CHAVES_PERSISTENCIA.atendimentos,
      JSON.stringify([
        {
          id: 21,
          ocorrenciaId: 13,
          usuarioId: 7,
          statusAnterior: 'Nova',
          statusNovo: 'Em análise',
          data: '2025-02-01T10:00:00.000Z',
        },
        {
          id: 22,
          ocorrenciaId: 999,
          usuarioId: 7,
          statusAnterior: 'Nova',
          statusNovo: 'Resolvida',
        },
      ]),
    );

    const usuarios = TestBed.inject(UsuarioService);
    const categorias = TestBed.inject(CategoriaService);
    const ocorrencias = TestBed.inject(OcorrenciaService);
    const atendimentos = TestBed.inject(AtendimentoService);
    const ocorrencia = ocorrencias.obter(13)!;

    expect(usuarios.obter(7)?.ativo).toBe(true);
    expect(ocorrencia).toMatchObject({ usuarioId: 7, status: 'Nova' });
    expect(categorias.nomePorId(ocorrencia.categoriaId)).toBe('Iluminação antiga');
    expect(atendimentos.lista()).toHaveLength(1);
    expect(atendimentos.lista()[0].data).toBeInstanceOf(Date);
    expect(
      JSON.parse(localStorage.getItem(CHAVES_PERSISTENCIA.ocorrencias) ?? '[]')[0],
    ).toMatchObject({ usuarioId: 7, categoriaId: ocorrencia.categoriaId });
  });

  it('persiste exclusões e não repõe exemplos quando existem listas vazias salvas', () => {
    const usuarios = TestBed.inject(UsuarioService);
    const categorias = TestBed.inject(CategoriaService);
    const ocorrencias = TestBed.inject(OcorrenciaService);

    usuarios.cadastrar({
      nome: 'Usuário temporário',
      email: 'temporario@exemplo.com',
      perfil: 'Cidadão',
    });
    usuarios.excluir(5);
    categorias.adicionar('Categoria temporária');
    const categoriaId = categorias.lista().at(-1)!.id;
    categorias.excluir(categoriaId);
    expect(ocorrencias.excluir(3)).toBe(true);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    expect(TestBed.inject(UsuarioService).obter(5)).toBeUndefined();
    expect(TestBed.inject(CategoriaService).obter(categoriaId)).toBeUndefined();
    expect(TestBed.inject(OcorrenciaService).obter(3)).toBeUndefined();

    localStorage.setItem(CHAVES_PERSISTENCIA.usuarios, '[]');
    localStorage.setItem(CHAVES_PERSISTENCIA.categorias, '[]');
    localStorage.setItem(CHAVES_PERSISTENCIA.ocorrencias, '[]');
    localStorage.setItem(CHAVES_PERSISTENCIA.atendimentos, '[]');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    expect(TestBed.inject(UsuarioService).lista()).toEqual([]);
    expect(TestBed.inject(CategoriaService).lista()).toEqual([]);
    expect(TestBed.inject(OcorrenciaService).lista()).toEqual([]);
    expect(TestBed.inject(AtendimentoService).lista()).toEqual([]);
  });
});
