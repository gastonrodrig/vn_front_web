import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavLanComponent } from './nav-lan.component';

describe('NavLanComponent', () => {
  let component: NavLanComponent;
  let fixture: ComponentFixture<NavLanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavLanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavLanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
