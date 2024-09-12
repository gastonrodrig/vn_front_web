import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCuposComponent } from './modal-cupos.component';

describe('ModalCuposComponent', () => {
  let component: ModalCuposComponent;
  let fixture: ComponentFixture<ModalCuposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCuposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCuposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
