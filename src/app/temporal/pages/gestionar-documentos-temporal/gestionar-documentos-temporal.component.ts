import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { SoloNumerosDirective } from '../../../shared/directives/solo-numeros.directive';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-gestionar-documentos-temporal',
  standalone: true,
  imports: [
    CommonModule, 
    MatProgressBar,
    SoloNumerosDirective, 
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatButtonModule
  ],
  templateUrl: './gestionar-documentos-temporal.component.html',
  styleUrl: './gestionar-documentos-temporal.component.css'
})
export class GestionarDocumentosTemporalComponent {
  loading = false
  dni = ''
}
