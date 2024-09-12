import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarZonaAcademicaComponent } from './gestionar-zona-academica.component';

describe('GestionarZonaAcademicaComponent', () => {
  let component: GestionarZonaAcademicaComponent;
  let fixture: ComponentFixture<GestionarZonaAcademicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarZonaAcademicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarZonaAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
