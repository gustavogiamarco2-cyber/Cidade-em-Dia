import { TestBed } from '@angular/core/testing';
import { NovaOcorrencia } from './models';
import { OcorrenciaService } from './ocorrencia-service';

describe('OcorrenciaService', () => {
  let servico: OcorrenciaService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    servico = TestBed.inject(OcorrenciaService);
  });

  it('edita os dados da ocorrência sem alterar status nem confirmações', () => {
    const original = servico.obter(1)!;
    const dados: NovaOcorrencia = {
      categoria: 'Iluminação',
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

  it('exclui uma ocorrência pelo identificador', () => {
    servico.excluir(1);

    expect(servico.obter(1)).toBeUndefined();
  });
});
