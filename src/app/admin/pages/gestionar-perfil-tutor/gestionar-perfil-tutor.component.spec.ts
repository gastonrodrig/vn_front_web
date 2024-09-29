import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPerfilTutorComponent } from './gestionar-perfil-tutor.component';

describe('GestionarPerfilTutorComponent', () => {
  let component: GestionarPerfilTutorComponent;
  let fixture: ComponentFixture<GestionarPerfilTutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarPerfilTutorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarPerfilTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
