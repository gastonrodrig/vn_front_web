import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarSeccionComponent } from './asignar-seccion.component';

describe('AsignarSeccionComponent', () => {
  let component: AsignarSeccionComponent;
  let fixture: ComponentFixture<AsignarSeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarSeccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
