import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarAlumnosComponent } from './gestionar-alumnos.component';

describe('GestionarAlumnosComponent', () => {
  let component: GestionarAlumnosComponent;
  let fixture: ComponentFixture<GestionarAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarAlumnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
