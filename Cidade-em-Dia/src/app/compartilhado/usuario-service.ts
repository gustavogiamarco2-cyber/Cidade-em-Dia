import { Injectable, inject, signal } from '@angular/core';
import { Perfil, UsuarioDados } from './models';
import { CHAVES_PERSISTENCIA, PersistenciaLocalService } from './persistencia-local-service';

const USUARIOS_INICIAIS: UsuarioDados[] = [
  { id: 1, nome: 'Maria Souza', email: 'maria@exemplo.com', perfil: 'Cidadão', ativo: true },
  { id: 2, nome: 'João Pereira', email: 'joao@exemplo.com', perfil: 'Atendente', ativo: true },
  { id: 3, nome: 'Ana Lima', email: 'ana@exemplo.com', perfil: 'Cidadão', ativo: false },
  {
    id: 4,
    nome: 'Administrador',
    email: 'admin@exemplo.com',
    perfil: 'Administrador',
    ativo: true,
  },
];

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly persistencia = inject(PersistenciaLocalService);
  private readonly dadosSalvos = this.persistencia.lerLista<unknown>(CHAVES_PERSISTENCIA.usuarios);
  private readonly _lista = signal<UsuarioDados[]>(
    this.dadosSalvos === undefined ? USUARIOS_INICIAIS : this.normalizar(this.dadosSalvos),
  );

  readonly lista = this._lista.asReadonly();

  constructor() {
    this.persistir();
  }

  obter(id: number): UsuarioDados | undefined {
    return this._lista().find((usuario) => usuario.id === id);
  }

  obterPorEmail(email: string): UsuarioDados | undefined {
    const emailNormalizado = email.trim().toLowerCase();
    return this._lista().find((usuario) => usuario.email.toLowerCase() === emailNormalizado);
  }

  obterPadrao(perfil: Perfil): UsuarioDados | undefined {
    const perfilUsuario = {
      cidadao: 'Cidadão',
      atendente: 'Atendente',
      admin: 'Administrador',
    }[perfil];
    return this._lista().find((usuario) => usuario.perfil === perfilUsuario);
  }

  obterOuCriarLegado(id?: number): UsuarioDados {
    const existente = id === undefined ? this.obterPadrao('cidadao') : this.obter(id);
    if (existente) return existente;

    const usuarioId =
      Number.isInteger(id) && Number(id) > 0
        ? Number(id)
        : Math.max(0, ...this._lista().map((usuario) => usuario.id)) + 1;
    const usuario: UsuarioDados = {
      id: usuarioId,
      nome: `Usuário legado ${usuarioId}`,
      email: `usuario-legado-${usuarioId}@local.invalid`,
      perfil: 'Cidadão',
      ativo: false,
    };
    this.atualizarLista((lista) => [...lista, usuario]);
    return usuario;
  }

  cadastrar(dados: Pick<UsuarioDados, 'nome' | 'email' | 'perfil'>): UsuarioDados {
    const usuario: UsuarioDados = {
      ...dados,
      id: Math.max(0, ...this._lista().map((item) => item.id)) + 1,
      ativo: true,
    };
    this.atualizarLista((lista) => [...lista, usuario]);
    return usuario;
  }

  atualizar(id: number, dados: Pick<UsuarioDados, 'nome' | 'email' | 'perfil'>): void {
    this.atualizarLista((lista) =>
      lista.map((usuario) => (usuario.id === id ? { ...usuario, ...dados } : usuario)),
    );
  }

  excluir(id: number): void {
    this.atualizarLista((lista) => lista.filter((usuario) => usuario.id !== id));
  }

  alternarSituacao(id: number): void {
    this.atualizarLista((lista) =>
      lista.map((usuario) => (usuario.id === id ? { ...usuario, ativo: !usuario.ativo } : usuario)),
    );
  }

  private normalizar(dados: unknown[]): UsuarioDados[] {
    const usuarios: UsuarioDados[] = [];
    for (const item of dados) {
      if (!item || typeof item !== 'object') continue;
      const registro = item as Partial<UsuarioDados>;
      if (!Number.isInteger(registro.id) || Number(registro.id) <= 0) continue;
      if (usuarios.some((usuario) => usuario.id === registro.id)) continue;
      usuarios.push({
        id: Number(registro.id),
        nome:
          typeof registro.nome === 'string' && registro.nome.trim()
            ? registro.nome
            : `Usuário ${registro.id}`,
        email: typeof registro.email === 'string' ? registro.email : '',
        perfil: typeof registro.perfil === 'string' ? registro.perfil : 'Cidadão',
        ativo: typeof registro.ativo === 'boolean' ? registro.ativo : true,
      });
    }
    return usuarios;
  }

  private atualizarLista(atualizar: (lista: UsuarioDados[]) => UsuarioDados[]): void {
    this._lista.update(atualizar);
    this.persistir();
  }

  private persistir(): void {
    this.persistencia.salvarLista(CHAVES_PERSISTENCIA.usuarios, this._lista());
  }
}
