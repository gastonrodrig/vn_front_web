import { Component, EventEmitter, Input, Output} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {
  @Input() sidebarShowed : any
  @Output() sidebarMostrado = new EventEmitter<Boolean>();

  sidebar: any

  menuClicked(sidebar: any) {
    this.sidebar = sidebar
    this.sidebarMostrado.emit(this.sidebar)
  }
}
