import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteGestionarPerfilComponent } from './docente-gestionar-perfil.component';

describe('DocenteGestionarPerfilComponent', () => {
  let component: DocenteGestionarPerfilComponent;
  let fixture: ComponentFixture<DocenteGestionarPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocenteGestionarPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteGestionarPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
