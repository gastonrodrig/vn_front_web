import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarEstudiantesComponent } from './gestionar-estudiantes.component';

describe('GestionarEstudiantesComponent', () => {
  let component: GestionarEstudiantesComponent;
  let fixture: ComponentFixture<GestionarEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarEstudiantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
