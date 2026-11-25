import { TestBed } from '@angular/core/testing';
import { AtendimentoService } from './atendimento-service';
import { CategoriaService } from './categoria-service';
import { NovaOcorrencia } from './models';
import { OcorrenciaService } from './ocorrencia-service';
import { UsuarioService } from './usuario-service';

describe('OcorrenciaService', () => {
  let servico: OcorrenciaService;
  let categorias: CategoriaService;
  let usuarios: UsuarioService;
  let atendimentos: AtendimentoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    servico = TestBed.inject(OcorrenciaService);
    categorias = TestBed.inject(CategoriaService);
    usuarios = TestBed.inject(UsuarioService);
    atendimentos = TestBed.inject(AtendimentoService);
  });

  it('edita os dados da ocorrência sem alterar status nem confirmações', () => {
    const original = servico.obter(1)!;
    const dados: NovaOcorrencia = {
      categoriaId: 2,
      descricao: 'Lâmpada queimada na via.',
      urgencia: 'Baixa',
      rua: 'Rua Nova',
      numero: '42',
      bairro: 'Centro',
      cidade: 'Curitiba',
      referencia: '',
    };

    servico.atualizar(original.id, dados);

    expect(servico.obter(original.id)).toMatchObject({
      ...dados,
      titulo: 'Iluminação na Rua Nova',
      prioridade: 'Baixa',
      status: original.status,
      confirmacoes: original.confirmacoes,
    });
  });

  it('normaliza registros legados e mantém referências válidas', () => {
    const legada = servico.obter(3)!;

    expect(legada).toMatchObject({ categoriaId: 3, usuarioId: 1 });
    expect(categorias.obter(legada.categoriaId)).toBeDefined();
    expect(usuarios.obter(legada.usuarioId)).toBeDefined();
    expect(
      servico
        .lista()
        .every(
          (ocorrencia) =>
            categorias.obter(ocorrencia.categoriaId) && usuarios.obter(ocorrencia.usuarioId),
        ),
    ).toBe(true);
    expect(
      atendimentos
        .lista()
        .every(
          (atendimento) =>
            servico.obter(atendimento.ocorrenciaId) && usuarios.obter(atendimento.usuarioId),
        ),
    ).toBe(true);
  });

  it('associa uma nova ocorrência aos identificadores existentes', () => {
    const nova = servico.registrar(
      {
        categoriaId: 2,
        descricao: 'Lâmpada queimada na via.',
        urgencia: 'Baixa',
        rua: 'Rua Nova',
        numero: '42',
        bairro: 'Centro',
        cidade: 'Curitiba',
        referencia: '',
      },
      1,
    );

    expect(nova).toMatchObject({ categoriaId: 2, usuarioId: 1 });
    expect(categorias.obter(nova.categoriaId)).toBeDefined();
    expect(usuarios.obter(nova.usuarioId)).toBeDefined();
  });

  it('registra cada mudança de status sem apagar o histórico anterior', () => {
    const ocorrencia = servico.obter(3)!;
    const historicoAnterior = atendimentos.lista();

    expect(servico.atualizarStatus(ocorrencia.id, 'Em análise', 2)).toBe(true);
    expect(servico.atualizarStatus(ocorrencia.id, 'Em análise', 2)).toBe(false);

    expect(atendimentos.lista()).toHaveLength(historicoAnterior.length + 1);
    expect(atendimentos.lista().slice(0, historicoAnterior.length)).toEqual(historicoAnterior);
    expect(atendimentos.lista().at(-1)).toMatchObject({
      ocorrenciaId: ocorrencia.id,
      usuarioId: 2,
      statusAnterior: 'Nova',
      statusNovo: 'Em análise',
    });
  });

  it('exclui uma ocorrência pelo identificador', () => {
    expect(servico.excluir(3)).toBe(true);

    expect(servico.obter(3)).toBeUndefined();
  });

  it('protege a ocorrência que possui histórico de atendimento', () => {
    expect(servico.excluir(1)).toBe(false);
    expect(servico.obter(1)).toBeDefined();
  });
});
