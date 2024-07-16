import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalApoderadoComponent } from './modal-apoderado.component';

describe('ModalApoderadoComponent', () => {
  let component: ModalApoderadoComponent;
  let fixture: ComponentFixture<ModalApoderadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalApoderadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalApoderadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
