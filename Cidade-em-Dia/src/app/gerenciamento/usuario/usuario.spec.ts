import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { provideRouter } from '@angular/router';
import { MenuLateral } from '../../compartilhado/menu-lateral/menu-lateral';
import { Usuario } from './usuario';

describe('Usuario', () => {
  let component: Usuario;
  let fixture: ComponentFixture<Usuario>;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      declarations: [Usuario, MenuLateral],
      imports: [MatTableModule, MatButtonModule],
      providers: [provideRouter([])],
}).compileComponents();

    fixture = TestBed.createComponent(Usuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve alternar a situação do usuário', () => {
    const usuario = component.usuarios()[0];

    expect(usuario.ativo).toBe(true);

    component.alternarSituacao(usuario);

    expect(component.usuarios()[0].ativo).toBe(false);
  });
});
