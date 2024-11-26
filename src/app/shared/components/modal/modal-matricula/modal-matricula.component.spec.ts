import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalMatriculaComponent } from './modal-matricula.component';

describe('ModalMatriculaComponent', () => {
  let component: ModalMatriculaComponent;
  let fixture: ComponentFixture<ModalMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalMatriculaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
