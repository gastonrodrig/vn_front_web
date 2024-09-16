import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPagosComponent } from './gestionar-pagos.component';

describe('GestionarPagosComponent', () => {
  let component: GestionarPagosComponent;
  let fixture: ComponentFixture<GestionarPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarPagosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
