import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Categoria } from './categoria';
import { MenuLateral } from '../../compartilhado/menu-lateral/menu-lateral';

describe('Categoria', () => {
  let component: Categoria;
  let fixture: ComponentFixture<Categoria>;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    await TestBed.configureTestingModule({
      declarations: [Categoria, MenuLateral],
      imports: [MatTableModule, MatButtonModule],
      providers: [
        provideRouter([]),
        { provide: MatDialog, useValue: { open: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Categoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve alternar a situação da categoria', () => {
    const categoria = component.categorias()[0];

    component.alternarSituacao(categoria);

    expect(component.categorias()[0].ativa).toBe(false);
  });

  it('deve criar uma categoria informada pelo usuário', () => {
    const dialogo = TestBed.inject(MatDialog);
    vi.mocked(dialogo.open).mockReturnValue({
      afterClosed: () => of('Praças'),
    } as never);
    const quantidadeInicial = component.categorias().length;

    component.novaCategoria();

    expect(component.categorias().length).toBe(quantidadeInicial + 1);
    expect(component.categorias().at(-1)?.nome).toBe('Praças');
    expect(component.categorias().at(-1)?.ativa).toBe(true);
  });

  it('deve editar o nome da categoria informada pelo usuário', () => {
    const dialogo = TestBed.inject(MatDialog);
    vi.mocked(dialogo.open).mockReturnValue({
      afterClosed: () => of('Buraco na via'),
    } as never);

    component.editarCategoria(component.categorias()[0]);

    expect(component.categorias()[0].nome).toBe('Buraco na via');
  });
});
