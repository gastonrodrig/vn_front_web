import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Input() model = ''
  @Input() icon = ''
  @Input() placeholder = ''
  @Input() widthFont = ''
  @Output() modelChange = new EventEmitter<string>()
  @Input() type = ''

  onModelChange(newTerm: string) {
    this.model = newTerm;
    this.modelChange.emit(newTerm);
  }
}
