import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInicioComponent } from './admin-inicio.component';

describe('AdminInicioComponent', () => {
  let component: AdminInicioComponent;
  let fixture: ComponentFixture<AdminInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
