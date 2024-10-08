import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarTutorComponent } from './gestionar-tutor.component';

describe('GestionarTutorComponent', () => {
  let component: GestionarTutorComponent;
  let fixture: ComponentFixture<GestionarTutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarTutorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
