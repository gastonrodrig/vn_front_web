import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignTableComponent } from './asign-table.component';

describe('AsignTableComponent', () => {
  let component: AsignTableComponent;
  let fixture: ComponentFixture<AsignTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
