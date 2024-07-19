import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDocenteComponent } from './modal-docente.component';

describe('ModalDocenteComponent', () => {
  let component: ModalDocenteComponent;
  let fixture: ComponentFixture<ModalDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDocenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
