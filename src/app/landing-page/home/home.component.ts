import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { InputComponent } from '../../shared/components/UI/input/input.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavLanComponent } from "../../shared/components/nav-lan/nav-lan.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InputComponent, MatButtonModule, MatProgressSpinnerModule, NavLanComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  

}
