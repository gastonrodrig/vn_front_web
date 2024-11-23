import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VacanteService } from '../../../core/services/vacante.service';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-admin-inicio',
  standalone: true,
  imports: [],
  templateUrl: './admin-inicio.component.html',
  styleUrl: './admin-inicio.component.css'
})
export class AdminInicioComponent implements OnInit{
  vacantesPorAnio: number = 0;
  solicitudesPorMes: number = 0;
  usuariosHabilitados: number = 0;
  
  constructor(
    private router: Router,
    private vacanteService: VacanteService,
    private solicitudService: SolicitudService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.obtenerVacantesPorAño();
    this.cargarSolicitudesDelMes();
    this.obtenerUsuariosHabilitados();
  }

  goToVacantes() {
    this.router.navigate(['/admin/gestionar-vacantes']);
  }

  goToSolicitudes(){
    this.router.navigate(['/admin/gestionar-solicitud']);
  }

  goToUsuarios(){
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
    )
  }
}
