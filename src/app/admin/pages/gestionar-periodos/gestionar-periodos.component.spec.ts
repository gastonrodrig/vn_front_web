import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPeriodosComponent } from './gestionar-periodos.component';

describe('GestionarPeriodosComponent', () => {
  let component: GestionarPeriodosComponent;
  let fixture: ComponentFixture<GestionarPeriodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarPeriodosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarPeriodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
