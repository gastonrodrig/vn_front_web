import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCambiarContraComponent } from './modal-cambiar-contra.component';

describe('ModalCambiarContraComponent', () => {
  let component: ModalCambiarContraComponent;
  let fixture: ComponentFixture<ModalCambiarContraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCambiarContraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCambiarContraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
