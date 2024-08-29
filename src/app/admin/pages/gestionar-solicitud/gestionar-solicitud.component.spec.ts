import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarSolicitudComponent } from './gestionar-solicitud.component';

describe('GestionarSolicitudComponent', () => {
  let component: GestionarSolicitudComponent;
  let fixture: ComponentFixture<GestionarSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarSolicitudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
