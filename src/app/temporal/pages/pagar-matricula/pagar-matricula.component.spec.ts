import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagarMatriculaComponent } from './pagar-matricula.component';

describe('PagarMatriculaComponent', () => {
  let component: PagarMatriculaComponent;
  let fixture: ComponentFixture<PagarMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagarMatriculaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagarMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
