import { Injectable, computed, inject, signal } from '@angular/core';
import { CategoriaDados } from './models';
import { CHAVES_PERSISTENCIA, PersistenciaLocalService } from './persistencia-local-service';

const CATEGORIAS_INICIAIS: CategoriaDados[] = [
  { id: 1, nome: 'Buraco', ativa: true },
  { id: 2, nome: 'Iluminação', ativa: true },
  { id: 3, nome: 'Descarte irregular', ativa: true },
  { id: 4, nome: 'Vazamento', ativa: true },
  { id: 5, nome: 'Sinalização danificada', ativa: true },
];

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly persistencia = inject(PersistenciaLocalService);
  private readonly dadosSalvos = this.persistencia.lerLista<unknown>(
    CHAVES_PERSISTENCIA.categorias,
  );
  private readonly _lista = signal<CategoriaDados[]>(
    this.dadosSalvos === undefined ? CATEGORIAS_INICIAIS : this.normalizar(this.dadosSalvos),
  );

  readonly lista = this._lista.asReadonly();
  readonly ativas = computed(() => this._lista().filter((c) => c.ativa));

  constructor() {
    this.persistir();
  }

  obter(id: number): CategoriaDados | undefined {
    return this._lista().find((categoria) => categoria.id === id);
  }

  nomePorId(id: number): string {
    return this.obter(id)?.nome ?? 'Categoria indisponível';
  }

  obterOuCriarLegada(nome: string): CategoriaDados {
    const nomeNormalizado = nome.trim();
    const existente = this._lista().find(
      (categoria) =>
        categoria.nome.trim().toLocaleLowerCase() === nomeNormalizado.toLocaleLowerCase(),
    );
    if (existente) return existente;

    const categoria: CategoriaDados = {
      id: Math.max(0, ...this._lista().map((item) => item.id)) + 1,
      nome: nomeNormalizado,
      ativa: false,
    };
    this.atualizarLista((lista) => [...lista, categoria]);
    return categoria;
  }

  adicionar(nome: string): void {
    this.atualizarLista((l) => [
      ...l,
      { id: Math.max(0, ...l.map((categoria) => categoria.id)) + 1, nome, ativa: true },
    ]);
  }

  renomear(id: number, nome: string): void {
    this.atualizarLista((l) => l.map((c) => (c.id === id ? { ...c, nome } : c)));
  }

  excluir(id: number): void {
    this.atualizarLista((l) => l.filter((c) => c.id !== id));
  }

  alternarSituacao(id: number): void {
    this.atualizarLista((l) => l.map((c) => (c.id === id ? { ...c, ativa: !c.ativa } : c)));
  }

  private normalizar(dados: unknown[]): CategoriaDados[] {
    const categorias: CategoriaDados[] = [];
    for (const item of dados) {
      if (!item || typeof item !== 'object') continue;
      const registro = item as Partial<CategoriaDados>;
      if (!Number.isInteger(registro.id) || Number(registro.id) <= 0) continue;
      if (categorias.some((categoria) => categoria.id === registro.id)) continue;
      categorias.push({
        id: Number(registro.id),
        nome:
          typeof registro.nome === 'string' && registro.nome.trim()
            ? registro.nome
            : `Categoria ${registro.id}`,
        ativa: typeof registro.ativa === 'boolean' ? registro.ativa : false,
      });
    }
    return categorias;
  }

  private atualizarLista(atualizar: (lista: CategoriaDados[]) => CategoriaDados[]): void {
    this._lista.update(atualizar);
    this.persistir();
  }

  private persistir(): void {
    this.persistencia.salvarLista(CHAVES_PERSISTENCIA.categorias, this._lista());
  }
}
