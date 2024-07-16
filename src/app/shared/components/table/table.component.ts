import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgxPaginationModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() columns!: { header: string, field: string }[];
  @Input() data!: any[];
  @Input() trackByField: string = '';
  @Input() loadedComplete: any

  @Output() editAction = new EventEmitter<{ isEdit: boolean, id: any }>();
  @Output() deleteAction = new EventEmitter<{ isDeleted: boolean, id: any }>();

  p: number = 1
  itemsPerPage: number = 5
  totalPages: any
  totalResults: any

  getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }

  edit(id: any) {
    this.editAction.emit({ isEdit: true, id });
  }

  delete(id: any) {
    this.deleteAction.emit({ isDeleted: true, id });
  }
  
  ngOnChanges() {
    if(this.loadedComplete === true) {
      this.totalResults = this.data.length
      this.totalPages = Math.ceil(this.data.length/this.itemsPerPage)
    }
  }
}
