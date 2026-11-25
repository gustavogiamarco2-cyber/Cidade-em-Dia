import { Injectable } from '@angular/core';

export const CHAVES_PERSISTENCIA = {
  usuarios: 'cidade-em-dia.usuarios',
  categorias: 'cidade-em-dia.categorias',
  ocorrencias: 'cidade-em-dia.ocorrencias',
  atendimentos: 'cidade-em-dia.atendimentos',
} as const;

@Injectable({ providedIn: 'root' })
export class PersistenciaLocalService {
  lerLista<T>(chave: string): T[] | undefined {
    try {
      const conteudo = globalThis.localStorage?.getItem(chave);
      if (conteudo === null || conteudo === undefined) return undefined;
      const dados: unknown = JSON.parse(conteudo);
      if (Array.isArray(dados)) return dados as T[];
      console.error(`Os dados locais de "${chave}" não estão em formato de lista.`);
      return undefined;
    } catch (erro) {
      console.error(`Não foi possível ler os dados locais de "${chave}".`, erro);
      return undefined;
    }
  }

  salvarLista<T>(chave: string, dados: readonly T[]): void {
    try {
      globalThis.localStorage?.setItem(chave, JSON.stringify(dados));
    } catch (erro) {
      console.error(`Não foi possível salvar os dados locais de "${chave}".`, erro);
    }
  }
}
