import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Inicial } from './inicial';
import { TelasModule } from '../telas-module';

describe('Inicial', () => {
  let component: Inicial;
  let fixture: ComponentFixture<Inicial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelasModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Inicial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable saving when the project name is empty or only whitespace', () => {
    const saveButton = fixture.nativeElement.querySelector(
      'button[mat-flat-button]',
    ) as HTMLButtonElement;

    expect(saveButton.disabled).toBe(true);

    component.nome = '   ';
    fixture.detectChanges();

    expect(saveButton.disabled).toBe(true);
  });

  it('should bind the fields and show a confirmation for a project name', async () => {
    const nameInput = fixture.nativeElement.querySelector(
      'input[name="nome"]',
    ) as HTMLInputElement;
    nameInput.value = 'Projeto exemplo';
    nameInput.dispatchEvent(new Event('input'));

    const descriptionInput = fixture.nativeElement.querySelector(
      'textarea[name="descricao"]',
    ) as HTMLTextAreaElement;
    descriptionInput.value = 'Descrição do projeto';
    descriptionInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();

    const saveButton = fixture.nativeElement.querySelector(
      'button[mat-flat-button]',
    ) as HTMLButtonElement;
    expect(component.nome).toBe('Projeto exemplo');
    expect(component.descricao).toBe('Descrição do projeto');
    expect(saveButton.disabled).toBe(false);

    saveButton.click();
    fixture.detectChanges();

    const status = fixture.nativeElement.querySelector(
      '[role="status"]',
    ) as HTMLElement;
    expect(status.textContent).toContain('Projeto "Projeto exemplo" validado!');
  });

  it('should clear the fields and confirmation', () => {
    component.nome = 'Projeto exemplo';
    component.descricao = 'Descrição do projeto';
    component.mensagem = 'Projeto validado';
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector(
      'button[mat-button]',
    ) as HTMLButtonElement;
    clearButton.click();
    fixture.detectChanges();

    expect(component.nome).toBe('');
    expect(component.descricao).toBe('');
    expect(component.mensagem).toBe('');
    expect(
      (fixture.nativeElement.querySelector('input[name="nome"]') as HTMLInputElement)
        .value,
    ).toBe('');
    expect(
      (
        fixture.nativeElement.querySelector(
          'textarea[name="descricao"]',
        ) as HTMLTextAreaElement
      ).value,
    ).toBe('');
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });
});
