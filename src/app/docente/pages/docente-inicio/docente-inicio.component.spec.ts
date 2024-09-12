import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteInicioComponent } from './docente-inicio.component';

describe('DocenteInicioComponent', () => {
  let component: DocenteInicioComponent;
  let fixture: ComponentFixture<DocenteInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocenteInicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
