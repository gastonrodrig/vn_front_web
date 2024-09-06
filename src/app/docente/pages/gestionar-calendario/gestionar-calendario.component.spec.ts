import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarCalendarioComponent } from './gestionar-calendario.component';

describe('GestionarCalendarioComponent', () => {
  let component: GestionarCalendarioComponent;
  let fixture: ComponentFixture<GestionarCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarCalendarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
