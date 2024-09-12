import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarCuposComponent } from './gestionar-cupos.component';

describe('GestionarCuposComponent', () => {
  let component: GestionarCuposComponent;
  let fixture: ComponentFixture<GestionarCuposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarCuposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarCuposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
