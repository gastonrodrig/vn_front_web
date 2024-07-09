import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarSeccionesComponent } from './gestionar-secciones.component';

describe('GestionarSeccionesComponent', () => {
  let component: GestionarSeccionesComponent;
  let fixture: ComponentFixture<GestionarSeccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarSeccionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarSeccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
