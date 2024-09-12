import { Component } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { listaDias } from '../../../shared/constants/itemsDays';
import { listaHoras } from '../../../shared/constants/itemsHoursPerDayClass';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TableComponent } from '../../../shared/components/table/table.component';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { HorarioService } from '../../../core/services/horario.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-docente-inicio',
  standalone: true,
  imports: [  
    TableComponent, 
    MatProgressBar, 
    FormsModule, 
    InputComponent, 
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './docente-inicio.component.html',
  styleUrl: './docente-inicio.component.css'
})
export class DocenteInicioComponent {
  horarios: any[] = [];  // Aquí se guardarán los horarios del docente
  loading = false;
  docenteId: any;
  
  // Listas de días y horas proporcionadas
  days = listaDias;
  times = listaHoras;

  horarioPorDiaYHora: any = {};  // Objeto para organizar horarios por día y hora

  constructor(
    private horarioService: HorarioService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Obtenemos el ID del docente autenticado
    this.docenteId = this.authService.getUser().docente._id;

    // Solicitamos los horarios del docente al servicio
    this.horarioService.listarHorariosPorDocente(this.docenteId).subscribe(
      (data: any) => {
        this.organizarHorarios(data);  // Organizamos los horarios
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Función para organizar los horarios en un objeto basado en día y hora
  organizarHorarios(data: any) {
    data.forEach((horario: any) => {
      const diaAbreviado = horario.dia_semana;  // Usamos el día abreviado directamente
      const hora = `${horario.hora_inicio} - ${horario.hora_fin}`;

      // Si el día no existe en el objeto, lo inicializamos
      if (!this.horarioPorDiaYHora[diaAbreviado]) {
        this.horarioPorDiaYHora[diaAbreviado] = {};
      }

      // Asignamos el horario al objeto según el día y la hora
      this.horarioPorDiaYHora[diaAbreviado][hora] = horario;
    });
  }

  // Método para verificar si hay un horario para un día y hora específicos
  isSelected(day: string, time: string): boolean {
    return this.horarioPorDiaYHora[day] && this.horarioPorDiaYHora[day][time];
  }

  // Obtiene la información del horario para un día y hora específicos
  getCellInfo(day: string, time: string): any {
    return this.horarioPorDiaYHora[day] ? this.horarioPorDiaYHora[day][time] : null;
  }
}