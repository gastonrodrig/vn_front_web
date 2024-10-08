import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPensionComponent } from './modal-pension.component';

describe('ModalPensionComponent', () => {
  let component: ModalPensionComponent;
  let fixture: ComponentFixture<ModalPensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPensionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
