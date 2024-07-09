import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarApoderadosComponent } from './gestionar-apoderados.component';

describe('GestionarApoderadosComponent', () => {
  let component: GestionarApoderadosComponent;
  let fixture: ComponentFixture<GestionarApoderadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarApoderadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarApoderadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
