import { Injectable, inject, signal } from '@angular/core';
import { CategoriaService } from './categoria-service';
import { AtendimentoService } from './atendimento-service';
import { NovaOcorrencia, Ocorrencia, Status } from './models';
import { CHAVES_PERSISTENCIA, PersistenciaLocalService } from './persistencia-local-service';
import { UsuarioService } from './usuario-service';

export interface FiltroOcorrencia {
  categoriaId?: number;
  status?: string;
  prioridade?: string;
  bairro?: string;
}

type OcorrenciaLegada = Partial<Ocorrencia> & {
  categoria?: string;
};

const OCORRENCIAS_INICIAIS: OcorrenciaLegada[] = [
  {
    id: 1,
    titulo: 'Buraco na Rua XV',
    categoria: 'Buraco',
    descricao: 'Buraco de grande dimensão localizado próximo à esquina.',
    rua: 'Rua XV',
    numero: '120',
    bairro: 'Centro',
    cidade: 'Curitiba',
    referencia: '',
    urgencia: 'Alta',
    prioridade: 'Alta',
    status: 'Em andamento',
    confirmacoes: 12,
    usuarioId: 1,
  },
  {
    id: 2,
    titulo: 'Poste sem iluminação',
    categoria: 'Iluminação',
    descricao: 'Poste apagado há vários dias.',
    rua: 'Rua Paraná',
    numero: '450',
    bairro: 'Batel',
    cidade: 'Curitiba',
    referencia: 'Em frente à padaria',
    urgencia: 'Média',
    prioridade: 'Média',
    status: 'Em análise',
    confirmacoes: 4,
    usuarioId: 1,
  },
  {
    id: 3,
    titulo: 'Lixo acumulado',
    categoria: 'Descarte irregular',
    descricao: 'Entulho descartado na calçada.',
    rua: 'Rua das Flores',
    numero: '88',
    bairro: 'Centro',
    cidade: 'Curitiba',
    referencia: '',
    urgencia: 'Média',
    prioridade: 'Média',
    status: 'Nova',
    confirmacoes: 2,
  },
  {
    id: 4,
    titulo: 'Vazamento na Av. Brasil',
    categoria: 'Vazamento',
    descricao: 'Vazamento de água na calçada.',
    rua: 'Av. Brasil',
    numero: '900',
    bairro: 'Portão',
    cidade: 'Curitiba',
    referencia: '',
    urgencia: 'Alta',
    prioridade: 'Alta',
    status: 'Nova',
    confirmacoes: 7,
    usuarioId: 3,
  },
  {
    id: 5,
    titulo: 'Placa de pare danificada',
    categoria: 'Sinalização danificada',
    descricao: 'Placa torta e ilegível.',
    rua: 'Rua Bahia',
    numero: '15',
    bairro: 'Batel',
    cidade: 'Curitiba',
    referencia: '',
    urgencia: 'Baixa',
    prioridade: 'Baixa',
    status: 'Resolvida',
    confirmacoes: 1,
    usuarioId: 3,
  },
  {
    id: 6,
    titulo: 'Buraco na Rua Sergipe',
    categoria: 'Buraco',
    descricao: 'Buraco na faixa da direita.',
    rua: 'Rua Sergipe',
    numero: '300',
    bairro: 'Portão',
    cidade: 'Curitiba',
    referencia: '',
    urgencia: 'Média',
    prioridade: 'Média',
    status: 'Resolvida',
    confirmacoes: 3,
    usuarioId: 1,
  },
];

// Os dados ficam em localStorage; não há integração com API.
@Injectable({ providedIn: 'root' })
export class OcorrenciaService {
  private readonly categorias = inject(CategoriaService);
  private readonly usuarios = inject(UsuarioService);
  private readonly atendimentos = inject(AtendimentoService);
  private readonly persistencia = inject(PersistenciaLocalService);
  private readonly dadosSalvos = this.persistencia.lerLista<unknown>(
    CHAVES_PERSISTENCIA.ocorrencias,
  );
  private readonly _lista = signal<Ocorrencia[]>(
    (this.dadosSalvos ?? OCORRENCIAS_INICIAIS)
      .map((item) => this.normalizar(item))
      .filter((item): item is Ocorrencia => item !== undefined),
  );

  readonly lista = this._lista.asReadonly();

  constructor() {
    this.persistir();
    this.atendimentos.reconciliarRelacionamentos(
      new Set(this._lista().map((ocorrencia) => ocorrencia.id)),
      new Set(this.usuarios.lista().map((usuario) => usuario.id)),
    );
  }

  obter(id: number): Ocorrencia | undefined {
    return this._lista().find((o) => o.id === id);
  }

  registrar(dados: NovaOcorrencia, usuarioId: number): Ocorrencia {
    const categoria = this.categorias.obter(dados.categoriaId);
    if (!categoria) throw new Error(`Categoria ${dados.categoriaId} não encontrada.`);
    if (!this.usuarios.obter(usuarioId)) throw new Error(`Usuário ${usuarioId} não encontrado.`);

    const nova: Ocorrencia = {
      ...dados,
      id: Math.max(0, ...this._lista().map((o) => o.id)) + 1,
      titulo: `${categoria.nome} na ${dados.rua}`,
      usuarioId,
      prioridade: dados.urgencia,
      status: 'Nova',
      confirmacoes: 0,
    };
    this.atualizarLista((lista) => [nova, ...lista]);
    return nova;
  }

  atualizar(id: number, dados: NovaOcorrencia): void {
    const categoria = this.categorias.obter(dados.categoriaId);
    if (!categoria) throw new Error(`Categoria ${dados.categoriaId} não encontrada.`);

    this.atualizarLista((lista) =>
      lista.map((ocorrencia) =>
        ocorrencia.id === id
          ? {
              ...ocorrencia,
              ...dados,
              titulo: `${categoria.nome} na ${dados.rua}`,
              prioridade: dados.urgencia,
            }
          : ocorrencia,
      ),
    );
  }

  excluir(id: number): boolean {
    if (this.atendimentos.possuiRegistrosDaOcorrencia(id)) return false;
    this.atualizarLista((lista) => lista.filter((ocorrencia) => ocorrencia.id !== id));
    return true;
  }

  atualizarStatus(id: number, status: Status, usuarioId: number): boolean {
    const ocorrencia = this.obter(id);
    if (!ocorrencia || ocorrencia.status === status) return false;
    if (!this.usuarios.obter(usuarioId)) throw new Error(`Usuário ${usuarioId} não encontrado.`);

    this.atendimentos.registrar({
      ocorrenciaId: id,
      usuarioId,
      statusAnterior: ocorrencia.status,
      statusNovo: status,
    });
    this.atualizarLista((lista) =>
      lista.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    return true;
  }

  confirmar(id: number): void {
    this.atualizarLista((lista) =>
      lista.map((o) => (o.id === id ? { ...o, confirmacoes: o.confirmacoes + 1 } : o)),
    );
  }

  filtrar(filtro: FiltroOcorrencia): Ocorrencia[] {
    return this._lista().filter(
      (o) =>
        (!filtro.categoriaId || o.categoriaId === filtro.categoriaId) &&
        (!filtro.status || o.status === filtro.status) &&
        (!filtro.prioridade || o.prioridade === filtro.prioridade) &&
        (!filtro.bairro || o.bairro === filtro.bairro),
    );
  }

  usaCategoria(categoriaId: number): boolean {
    return this._lista().some((ocorrencia) => ocorrencia.categoriaId === categoriaId);
  }

  usaUsuario(usuarioId: number): boolean {
    return this._lista().some((ocorrencia) => ocorrencia.usuarioId === usuarioId);
  }

  contar(
    chave: 'categoriaId' | 'status' | 'urgencia' | 'bairro',
  ): { rotulo: string; total: number }[] {
    const mapa = new Map<string, number>();
    for (const o of this._lista()) {
      const rotulo = String(o[chave]);
      mapa.set(rotulo, (mapa.get(rotulo) ?? 0) + 1);
    }
    return [...mapa]
      .map(([rotulo, total]) => ({ rotulo, total }))
      .sort((a, b) => b.total - a.total);
  }

  private normalizar(registro: unknown): Ocorrencia | undefined {
    if (!registro || typeof registro !== 'object') return undefined;
    const dados = registro as OcorrenciaLegada;
    if (!Number.isInteger(dados.id) || Number(dados.id) <= 0) return undefined;

    const categoriaExistente =
      Number.isInteger(dados.categoriaId) && dados.categoriaId! > 0
        ? this.categorias.obter(dados.categoriaId!)
        : undefined;
    const categoriaRelacionada =
      categoriaExistente ??
      this.categorias.obterOuCriarLegada(
        typeof dados.categoria === 'string' && dados.categoria.trim()
          ? dados.categoria
          : 'Categoria indisponível',
      );
    const usuarioRelacionado =
      Number.isInteger(dados.usuarioId) && dados.usuarioId! > 0
        ? this.usuarios.obterOuCriarLegado(dados.usuarioId)
        : this.usuarios.obterOuCriarLegado();

    return {
      id: Number(dados.id),
      titulo:
        typeof dados.titulo === 'string' && dados.titulo.trim()
          ? dados.titulo
          : `${categoriaRelacionada.nome} na ${typeof dados.rua === 'string' ? dados.rua : 'local informado'}`,
      categoriaId: categoriaRelacionada.id,
      usuarioId: usuarioRelacionado.id,
      descricao: typeof dados.descricao === 'string' ? dados.descricao : '',
      rua: typeof dados.rua === 'string' ? dados.rua : '',
      numero: typeof dados.numero === 'string' ? dados.numero : '',
      bairro: typeof dados.bairro === 'string' ? dados.bairro : '',
      cidade: typeof dados.cidade === 'string' ? dados.cidade : '',
      referencia: typeof dados.referencia === 'string' ? dados.referencia : '',
      urgencia: this.nivelValido(dados.urgencia) ? dados.urgencia : 'Baixa',
      prioridade: this.nivelValido(dados.prioridade) ? dados.prioridade : 'Baixa',
      status: this.statusValido(dados.status) ? dados.status : 'Nova',
      confirmacoes:
        Number.isInteger(dados.confirmacoes) && Number(dados.confirmacoes) >= 0
          ? Number(dados.confirmacoes)
          : 0,
      foto: typeof dados.foto === 'string' ? dados.foto : undefined,
    };
  }

  private nivelValido(nivel: unknown): nivel is Ocorrencia['urgencia'] {
    return nivel === 'Baixa' || nivel === 'Média' || nivel === 'Alta';
  }

  private statusValido(status: unknown): status is Status {
    return (
      status === 'Nova' ||
      status === 'Em análise' ||
      status === 'Em andamento' ||
      status === 'Resolvida'
    );
  }

  private atualizarLista(atualizar: (lista: Ocorrencia[]) => Ocorrencia[]): void {
    this._lista.update(atualizar);
    this.persistir();
  }

  private persistir(): void {
    this.persistencia.salvarLista(CHAVES_PERSISTENCIA.ocorrencias, this._lista());
  }
}
