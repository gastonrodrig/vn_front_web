import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarVacantesComponent } from './gestionar-vacantes.component';

describe('GestionarVacantesComponent', () => {
  let component: GestionarVacantesComponent;
  let fixture: ComponentFixture<GestionarVacantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarVacantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarVacantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
