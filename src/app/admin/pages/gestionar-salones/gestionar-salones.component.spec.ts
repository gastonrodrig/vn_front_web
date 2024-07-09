import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarSalonesComponent } from './gestionar-salones.component';

describe('GestionarSalonesComponent', () => {
  let component: GestionarSalonesComponent;
  let fixture: ComponentFixture<GestionarSalonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarSalonesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarSalonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
