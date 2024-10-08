import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TableComponent } from '../../../shared/components/table/table.component';
import { CuposService } from '../../../core/services/cupos.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalCuposComponent } from '../../../shared/components/modal/modal-cupos/modal-cupos.component';
import { SelectComponent } from '../../../shared/components/UI/select/select.component';
import { GradoService } from '../../../core/services/grado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-cupos',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, SelectComponent, MatButtonModule],
  templateUrl: './gestionar-cupos.component.html',
  styleUrl: './gestionar-cupos.component.css'
})
export class GestionarCuposComponent {
  cupos: any[] = []
  cupo: any[] = []
  grados: any[] = []
  trackByField = '_id'
  loading = false
  loadedComplete: any
  searchTerm: string = '';
  gradoSelected = 'all'

  columns = [
    { header: 'Capacidad', field: 'capacidad' },
    { header: 'Vacantes Disponibles', field: 'vacantes_disponibles' },
    { header: 'Grado', field: 'grado.nombre' },
    { header: 'Periodo', field: 'periodo.anio' }
  ];

  constructor(
    private cuposService: CuposService,
    private gradoService: GradoService,
    public dialog: MatDialog,
    private router: Router
  ){}

  ngOnInit() {
    this.loading = true
    this.cuposService.listarCupos().subscribe(
      (data: any) => {
        this.cupos = this.ordenarDatosPorGrado(data) 
        this.loading = false
        this.loadedComplete = true
      },
      (error) => {
        this.loading = false
        Swal.fire('Error', 'Error al cargar los datos', 'error')
        console.log(error)
      }
    )
    this.gradoService.listarGrados().subscribe(
      (data: any) => {
        this.grados = data
      },
      (error) => {
        console.log(error)
      }
    )
  }

  displayedCupos() {
    return this.cupos.filter((cupo: any) => {
      const matchGrado = this.gradoSelected === 'all' || cupo.grado._id === this.gradoSelected
      return matchGrado 
    });
  }

  agregarCupo() {
    const dialogRef = this.dialog.open(ModalCuposComponent, {
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.cuposService.listarCupos().subscribe(
          (data: any) => {
            this.cupos = this.ordenarDatosPorGrado(data) 
          },
          (error) => {
            console.log(error)
          }
        )
      }
    )
  }
  
  extractNumber(str: string)  {
    const match = str.match(/\d+/)
    return match ? parseInt(match[0], 10) : 0
  }

  ordenarDatosPorGrado(data: any[]) {
    return data.sort((a, b) => {
      const numberA = this.extractNumber(a.grado.nombre);
      const numberB = this.extractNumber(b.grado.nombre);

      return numberA - numberB
    });
  }

}
