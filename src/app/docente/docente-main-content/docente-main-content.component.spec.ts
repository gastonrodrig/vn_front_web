import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteMainContentComponent } from './docente-main-content.component';

describe('DocenteMainContentComponent', () => {
  let component: DocenteMainContentComponent;
  let fixture: ComponentFixture<DocenteMainContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocenteMainContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteMainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
