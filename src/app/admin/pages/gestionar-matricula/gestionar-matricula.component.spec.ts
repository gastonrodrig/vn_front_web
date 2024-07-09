import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarMatriculaComponent } from './gestionar-matricula.component';

describe('GestionarMatriculaComponent', () => {
  let component: GestionarMatriculaComponent;
  let fixture: ComponentFixture<GestionarMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarMatriculaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
