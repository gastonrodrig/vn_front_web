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
  @Input() optionSelected: string = 'all';
  @Input() options: any[] = [];
  @Input() nombreFiltro: string = '';
  @Input() optionKey: string = '';
  @Input() optionLabel: string = '';
  @Output() optionSelectedChange = new EventEmitter<string>()

  onOptionSelectedChange(newOption: string) {
    this.optionSelected = newOption;
    this.optionSelectedChange.emit(newOption);
  }
}
