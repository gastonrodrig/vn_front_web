import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPerfilDocenteComponent } from './gestionar-perfil-docente.component';

describe('GestionarPerfilDocenteComponent', () => {
  let component: GestionarPerfilDocenteComponent;
  let fixture: ComponentFixture<GestionarPerfilDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarPerfilDocenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarPerfilDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
