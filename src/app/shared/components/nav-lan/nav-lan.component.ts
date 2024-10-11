import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-lan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-lan.component.html',
  styleUrl: './nav-lan.component.css'
})
export class NavLanComponent {
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
