import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemporalMainContentComponent } from './temporal-main-content.component';

describe('TemporalMainContentComponent', () => {
  let component: TemporalMainContentComponent;
  let fixture: ComponentFixture<TemporalMainContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporalMainContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporalMainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
