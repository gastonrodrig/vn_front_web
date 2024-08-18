import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarDocumentosTemporalComponent } from './gestionar-documentos-temporal.component';

describe('GestionarDocumentosTemporalComponent', () => {
  let component: GestionarDocumentosTemporalComponent;
  let fixture: ComponentFixture<GestionarDocumentosTemporalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarDocumentosTemporalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarDocumentosTemporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
