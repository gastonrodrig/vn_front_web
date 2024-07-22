import { Component } from '@angular/core';
import { InputComponent } from '../../shared/components/UI/input/input.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  searchTerm: string = '';
}
