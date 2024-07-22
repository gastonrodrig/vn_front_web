import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [FormsModule ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {
  @Input() optionSelected = 'all'
  @Input() options: any[] = [];
  @Input() nombreFiltro = ''
  @Input() optionKey = ''
  @Input() optionLabel = ''
  @Input() width = ''
  @Output() optionSelectedChange = new EventEmitter<string>()

  onOptionSelectedChange(newOption: string) {
    this.optionSelected = newOption;
    this.optionSelectedChange.emit(newOption);
  }
}
