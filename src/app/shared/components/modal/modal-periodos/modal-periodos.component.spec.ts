import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPeriodosComponent } from './modal-periodos.component';

describe('ModalPeriodosComponent', () => {
  let component: ModalPeriodosComponent;
  let fixture: ComponentFixture<ModalPeriodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPeriodosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPeriodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
