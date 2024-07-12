import { Component } from '@angular/core';
import { EstudianteService } from '../../../core/services/admin/estudiante.service';

@Component({
  selector: 'app-gestionar-estudiantes',
  standalone: true,
  imports: [],
  templateUrl: './gestionar-estudiantes.component.html',
  styleUrl: './gestionar-estudiantes.component.css'
})
export class GestionarEstudiantesComponent {

  estudiantes: any

  constructor(
    private estudianteService: EstudianteService
  ){}

  ngOnInit() {
    this.estudianteService.listarEstudiantes().subscribe(
      (data: any) => {
        this.estudiantes = data
        console.log(this.estudiantes)
      },
      (error) => {
        console.log(error)
      }
    )
  }
}
