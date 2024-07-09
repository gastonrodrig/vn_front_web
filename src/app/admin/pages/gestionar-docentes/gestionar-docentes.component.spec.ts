import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarDocentesComponent } from './gestionar-docentes.component';

describe('GestionarDocentesComponent', () => {
  let component: GestionarDocentesComponent;
  let fixture: ComponentFixture<GestionarDocentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarDocentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarDocentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
