import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPensionComponent } from './gestionar-pension.component';

describe('GestionarPensionComponent', () => {
  let component: GestionarPensionComponent;
  let fixture: ComponentFixture<GestionarPensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarPensionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
