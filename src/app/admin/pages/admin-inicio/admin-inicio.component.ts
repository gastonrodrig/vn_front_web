import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VacanteService } from '../../../core/services/vacante.service';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { UserService } from '../../../core/services/user.service';
import { Chart, CategoryScale, LinearScale, Title, Tooltip, Legend, LineController, PointElement, LineElement } from 'chart.js'; // Importar el elemento PointElement
import { PagoService } from '../../../core/services/pagos.service';

@Component({
  selector: 'app-admin-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-inicio.component.html',
  styleUrls: ['./admin-inicio.component.css'],
})
export class AdminInicioComponent implements OnInit {
  vacantesPorAnio: number = 0;
  solicitudesPorMes: number = 0;
  usuariosHabilitados: number = 0;

  currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  daysInMonth: number[] = [];
  firstDayOfMonth: number = 0;

  gananciasPorMes: { _id: string, totalGanancias: number }[] = []; 

  constructor(
    private router: Router,
    private vacanteService: VacanteService,
    private solicitudService: SolicitudService,
    private userService: UserService,
    private pagoService: PagoService
  ) {}

  ngOnInit(): void {
    this.obtenerVacantesPorAño();
    this.cargarSolicitudesDelMes();
    this.obtenerUsuariosHabilitados();
    this.updateCalendar();
    this.obtenerGananciasPorMes();
  }

  ngAfterViewInit() {
    this.renderizarGrafico();
  }

  goToVacantes() {
    this.router.navigate(['/admin/gestionar-vacantes']);
  }

  goToSolicitudes() {
    this.router.navigate(['/admin/gestionar-solicitud']);
  }

  goToUsuarios() {
    this.router.navigate(['/admin/gestionar-usuarios']);
  }

  obtenerVacantesPorAño(): void {
    this.vacanteService.contarVacantesPorAño().subscribe(
      (vacantes) => {
        this.vacantesPorAnio = vacantes;
      },
      (error) => {
        console.error('Error al obtener las vacantes', error);
      }
    );
  }

  cargarSolicitudesDelMes(): void {
    this.solicitudService.obtenerSolicitudPorMes().subscribe(
      (cantidad) => {
        this.solicitudesPorMes = cantidad;
      },
      (error) => {
        console.error('Error al obtener las solicitudes del mes', error);
      }
    );
  }

  obtenerUsuariosHabilitados(): void {
    this.userService.contarUsuariosHabilitados().subscribe(
      (cantidad) => {
        this.usuariosHabilitados = cantidad;
      },
      (error) => {
        console.error('Error al obtener los usuarios habilitados', error);
      }
    );
  }

  updateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    this.firstDayOfMonth = firstDay;

    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.updateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.updateCalendar();
  }

  isToday(day: number): boolean {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === this.currentMonth && today.getFullYear() === this.currentYear;
  }

  obtenerGananciasPorMes(): void {
    this.pagoService.obtenerGananciasPorMes().subscribe(
      (ganancias: { _id: string; totalGanancias: number }[]) => {
        this.gananciasPorMes = ganancias;
        this.renderizarGrafico();
      },
      (error) => {
        console.error('Error al obtener las ganancias', error);
      }
    );
  }

  renderizarGrafico(): void {
    console.log(this.gananciasPorMes);
    
    if (this.gananciasPorMes.length === 0) return;

    const ctx = document.getElementById('monthly-gains-chart') as HTMLCanvasElement;

    ctx.width = 1200;
    ctx.height = 400;

    const chartData = this.gananciasPorMes.map((item) => item.totalGanancias);
    const labels = this.gananciasPorMes.map((item) => item._id);

    Chart.register(
      CategoryScale,
      LinearScale,
      Title,
      Tooltip,
      Legend,
      LineController,
      PointElement,
      LineElement
    );

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Ganancias por mes',
          data: chartData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Meses'
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Ganancias'
            }
          }
        }
      }
    });
  }
}