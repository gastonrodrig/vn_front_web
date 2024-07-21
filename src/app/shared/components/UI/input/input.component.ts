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
  @Input() searchTerm = ''
  @Input() icon = ''
  @Output() searchTermChange = new EventEmitter<string>()

  onSearchTermChange(newTerm: string) {
    this.searchTerm = newTerm;
    this.searchTermChange.emit(newTerm);
  }
}
