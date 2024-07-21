import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSeccionComponent } from './modal-seccion.component';

describe('ModalSeccionComponent', () => {
  let component: ModalSeccionComponent;
  let fixture: ComponentFixture<ModalSeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSeccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
