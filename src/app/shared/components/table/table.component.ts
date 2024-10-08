import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() columns!: { header: string, field: string }[];
  @Input() data!: any[];
  @Input() trackByField: string = '';
  @Input() loadedComplete: any
  @Input() editActive: any
  @Input() deleteActive: any
  @Input() asignActive: any
  @Input() hoursActive: any
  @Input() pfpActive: any
  @Input() filesActive: any
  @Input() noActions: any
  @Input() requestActive: any
  @Input() vacantActive: any
  @Input() userActive: any
  @Input() actionsByState: { [key: string]: { icon: string, action: string, style: string }[] } = {};

  @Output() editAction = new EventEmitter<{ isEdit: boolean, id: any }>();
  @Output() deleteAction = new EventEmitter<{ isDeleted: boolean, id: any }>();
  @Output() asignAction = new EventEmitter<{ isAsigned: boolean, id: any }>();
  @Output() hoursAction = new EventEmitter<{ isHours: boolean, id: any }>();
  @Output() pfpAction = new EventEmitter<{ isPfp: boolean, id: any }>();
  @Output() filesAction = new EventEmitter<{ isFiles: boolean, id: any }>();
  @Output() requestAction = new EventEmitter<{ isRequest: boolean, id: any }>();
  @Output() vacantAction = new EventEmitter<{ isVacant: boolean, id: any }>();
  @Output() actionEvent = new EventEmitter<{ id: any, action: string }>();

  p: number = 1
  itemsPerPage: number = 5
  totalPages: any
  totalResults: any

  getNestedProperty(obj: any, path: string): any {
    if (path === 'estudiante') {
      return `${obj.estudiante.apellido}, ${obj.estudiante.nombre}`;
    }
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }

  edit(id: any) {
    this.editAction.emit({ isEdit: true, id });
  }

  delete(id: any) {
    this.deleteAction.emit({ isDeleted: true, id });
  }

  asign(id: any) {
    this.asignAction.emit({ isAsigned: true, id });
  }

  hours(id: any) {
    this.hoursAction.emit({ isHours: true, id });
  }

  pfp(id: any) {
    this.pfpAction.emit({ isPfp: true, id });
  }

  files(id: any) {
    this.filesAction.emit({ isFiles: true, id });
  }

  vacant(id: any) {
    this.vacantAction.emit({ isVacant: true, id });
  }
  
  handleActionState(id: any, action: string) {
    this.actionEvent.emit({ id, action });
  }

  getActionsState(state: string) {
    return this.actionsByState[state] || [];
  }
  
  ngOnChanges() {
    if(this.loadedComplete === true) {
      this.totalResults = this.data.length
      this.totalPages = Math.ceil(this.data.length/this.itemsPerPage)
    }
  }
}
