import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarCalificacionesComponent } from './gestionar-calificaciones.component';

describe('GestionarCalificacionesComponent', () => {
  let component: GestionarCalificacionesComponent;
  let fixture: ComponentFixture<GestionarCalificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarCalificacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarCalificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
