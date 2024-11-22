import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VacanteService } from '../../../core/services/vacante.service';

@Component({
  selector: 'app-admin-inicio',
  standalone: true,
  imports: [],
  templateUrl: './admin-inicio.component.html',
  styleUrl: './admin-inicio.component.css'
})
export class AdminInicioComponent implements OnInit{
  vacantesPorAnio: number = 0;
  
  constructor(
    private router: Router,
    private vacanteService: VacanteService
  ) {}

  ngOnInit(): void {
    this.obtenerVacantesPorAño();
  }

  goToVacantes() {
    this.router.navigate(['/admin/gestionar-vacantes']);
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
}
