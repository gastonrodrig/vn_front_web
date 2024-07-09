import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarGradoComponent } from './gestionar-grado.component';

describe('GestionarGradoComponent', () => {
  let component: GestionarGradoComponent;
  let fixture: ComponentFixture<GestionarGradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarGradoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarGradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
