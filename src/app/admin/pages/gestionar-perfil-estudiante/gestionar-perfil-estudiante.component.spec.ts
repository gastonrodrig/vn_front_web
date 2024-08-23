import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPerfilEstudianteComponent } from './gestionar-perfil-estudiante.component';

describe('GestionarPerfilEstudianteComponent', () => {
  let component: GestionarPerfilEstudianteComponent;
  let fixture: ComponentFixture<GestionarPerfilEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarPerfilEstudianteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarPerfilEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
