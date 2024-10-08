import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTutorComponent } from './modal-tutor.component';

describe('ModalTutorComponent', () => {
  let component: ModalTutorComponent;
  let fixture: ComponentFixture<ModalTutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTutorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
