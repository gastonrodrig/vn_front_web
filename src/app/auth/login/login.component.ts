import { Component } from '@angular/core';
import { InputComponent } from '../../shared/components/UI/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  searchTerm: string = '';
}
