import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporalLayoutComponent } from './temporal-layout.component';

describe('TemporalLayoutComponent', () => {
  let component: TemporalLayoutComponent;
  let fixture: ComponentFixture<TemporalLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporalLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
