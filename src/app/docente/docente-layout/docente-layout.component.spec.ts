import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteLayoutComponent } from './docente-layout.component';

describe('DocenteLayoutComponent', () => {
  let component: DocenteLayoutComponent;
  let fixture: ComponentFixture<DocenteLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocenteLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
