import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignarHorasComponent } from './modal-asignar-horas.component';

describe('ModalAsignarHorasComponent', () => {
  let component: ModalAsignarHorasComponent;
  let fixture: ComponentFixture<ModalAsignarHorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAsignarHorasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAsignarHorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
