import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarDocumentosComponent } from './gestionar-documentos.component';

describe('GestionarDocumentosComponent', () => {
  let component: GestionarDocumentosComponent;
  let fixture: ComponentFixture<GestionarDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarDocumentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
