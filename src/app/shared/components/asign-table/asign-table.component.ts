import { Component } from '@angular/core';

@Component({
  selector: 'app-asign-table',
  standalone: true,
  imports: [],
  templateUrl: './asign-table.component.html',
  styleUrl: './asign-table.component.css'
})
export class AsignTableComponent {
  // displayedColumns: string[] = ['select', 'student']
  // dataSource = new MatTableDataSource<any>([])
  // selection = new SelectionModel<any>(true, [])

  // /** Si el número de elementos seleccionados coincide con el número total de filas. */
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length
  //   const numRows = this.dataSource.data.length
  //   return numSelected === numRows
  // }

  // /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, borra todo. */
  // toggleAllRows() {
  //   if (this.isAllSelected()) {
  //     this.selection.clear()
  //     return;
  //   }
  //   this.selection.select(...this.dataSource.data)
  // }

  // /** La etiqueta para el checkbox en la fila pasada */
  // checkboxLabel(row?: any): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`
  // }
}
