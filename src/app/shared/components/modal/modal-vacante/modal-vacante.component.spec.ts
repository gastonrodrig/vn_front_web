import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVacanteComponent } from './modal-vacante.component';

describe('ModalVacanteComponent', () => {
  let component: ModalVacanteComponent;
  let fixture: ComponentFixture<ModalVacanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVacanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVacanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
