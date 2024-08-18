import { Component, EventEmitter, Input, Output} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-admin-main-content',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './admin-main-content.component.html',
  styleUrl: './admin-main-content.component.css'
})
export class AdminMainContentComponent {
  @Input() sidebarShowed : any
  @Output() sidebarMostrado = new EventEmitter<Boolean>();

  sidebar: any

  menuClicked(sidebar: any) {
    this.sidebar = sidebar
    this.sidebarMostrado.emit(this.sidebar)
  }
}