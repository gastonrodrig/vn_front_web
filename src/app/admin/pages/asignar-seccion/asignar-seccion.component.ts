import {SelectionModel} from '@angular/cdk/collections';
import {Component} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SeccionGradoPeriodoService } from '../../../core/services/seccion-grado-periodo.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-asignar-seccion',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule, MatProgressBarModule, InputComponent, MatButtonModule],
  templateUrl: './asignar-seccion.component.html',
  styleUrl: './asignar-seccion.component.css'
})
export class AsignarSeccionComponent {
  seccionGradoPeriodo: any;
  searchTerm = ''
  grado = {
    nombre: ''
  }
  periodo = {
    anio: ''
  }
  seccion = {
    aula: ''
  }
  estudiantesXPeriodoGrado: any[] = [];
  sgpId: any;
  seccionId: any
  loading = false;
  estudiantesSinSalon: any;
  estudiantesConSalon: any
  displayedColumns: string[] = ['select', 'student'];
  dataSource = new MatTableDataSource<any>([])
  dataSourceAsignados = new MatTableDataSource<any>([]);
  selectionSinSalon = new SelectionModel<any>(true, []); // SelectionModel para la primera tabla
  selectionAsignados = new SelectionModel<any>(true, []);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private sgpService: SeccionGradoPeriodoService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => this.sgpId = params.get('id'));
    this.loading = true;

    this.sgpService.obtenerSeccionGradoPeriodo(this.sgpId).subscribe(
      (data: any) => {
        this.seccionGradoPeriodo = data;
        this.grado.nombre = data.grado.nombre
        this.periodo.anio = data.periodo.anio
        this.seccion.aula = data.seccion.aula
        this.seccionId = data.seccion.seccion_id
        this.listarEstudiantesSinSalon()
        this.listarEstudiantesConSalon()
      },
      (error) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  listarEstudiantesSinSalon() {
    this.estudianteService.listarEstudiantePorGradoYPeriodo(
      this.seccionGradoPeriodo.grado.grado_id,
      this.seccionGradoPeriodo.periodo.periodo_id
    ).subscribe(
      (data: any) => {
        this.loading = false;
        this.estudiantesXPeriodoGrado = data.sort((a: any, b: any) => {
          if (a.apellido < b.apellido) {
            return -1;
          }
          if (a.apellido > b.apellido) {
            return 1;
          }
          return 0;
        });
        this.dataSource.data = this.estudiantesXPeriodoGrado;
      },
      (error) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  listarEstudiantesConSalon() {
    this.estudianteService.listarEstudiantePorSeccionGradoYPeriodo(
      this.seccionGradoPeriodo.seccion.seccion_id,
      this.seccionGradoPeriodo.grado.grado_id,
      this.seccionGradoPeriodo.periodo.periodo_id
    ).subscribe(
      (data: any) => {
        this.loading = false;
        this.estudiantesConSalon = data.sort((a: any, b: any) => {
          if (a.apellido < b.apellido) {
            return -1;
          }
          if (a.apellido > b.apellido) {
            return 1;
          }
          return 0;
        });
        this.dataSourceAsignados.data = this.estudiantesConSalon;
      }
    )
  }

  displayedEstudiantesXGradoPeriodo() {
    return this.dataSource.data.filter((e: any) =>
      e.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.apellido.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  displayedEstudiantesXSeccion() {
    return this.dataSourceAsignados.data.filter((e: any) =>
      e.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.apellido.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  volverSecciones() {
    this.router.navigate([`/admin/gestionar-secciones`]);
  }

  isAllSelected(dataSource: MatTableDataSource<any>, selection: SelectionModel<any>): boolean {
    const numSelected = selection.selected.length;
    const numRows = dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(dataSource: MatTableDataSource<any>, selection: SelectionModel<any>) {
    if (this.isAllSelected(dataSource, selection)) {
      selection.clear()
    } else {
      selection.select(...dataSource.data)
    }
    this.estudiantesSinSalon = this.selectionSinSalon.selected
    this.estudiantesConSalon = this.selectionAsignados.selected
  }

  toggleRowSelection(row: any, selection: SelectionModel<any>) {
    selection.toggle(row)
    this.estudiantesSinSalon = this.selectionSinSalon.selected
    this.estudiantesConSalon = this.selectionAsignados.selected
  }

  desplazarEstudiantesSinSalon() {
    const data = {
      seccion_id: this.seccionId
    }
    this.estudiantesSinSalon.forEach((e: any) => {
      this.loading = true
      this.estudianteService.asignarSeccion(e.estudiante_id, data).subscribe(
        (data: any) => {
          this.loading = false
          this.listarEstudiantesSinSalon()
          this.listarEstudiantesConSalon()
          this.selectionSinSalon.clear()
          this.selectionAsignados.clear()
          this.snack.open('Estudiantes desplazados', 'Cerrar', {
            duration: 3000 
         })
        },
        (error) => {
          this.loading = false
          console.error(error)
        }
      );
    });
  }

  desplazarEstudiantesConSalon() {
    console.log(this.estudiantesConSalon)
    this.estudiantesConSalon.forEach((e: any) => {
      this.loading = true
      this.estudianteService.eliminarSeccion(e.estudiante_id).subscribe(
        (data: any) => {
          this.listarEstudiantesSinSalon()
          this.listarEstudiantesConSalon()
          this.selectionSinSalon.clear()
          this.selectionAsignados.clear()
          this.snack.open('Estudiantes desplazados', 'Cerrar', {
            duration: 3000 
         })
        },
        (error) => {
          this.loading = false
          console.error(error)
        }
      );
    });
  }

  checkboxLabel(dataSource: MatTableDataSource<any>, selection: SelectionModel<any>, row?: any): string {
    if (!row) {
      return `${this.isAllSelected(dataSource, selection) ? 'deselect' : 'select'} all`;
    }
    return `${selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
