import { Component } from '@angular/core';
import { ApoderadoService } from '../../../core/services/admin/apoderado.service';

@Component({
  selector: 'app-gestionar-apoderados',
  standalone: true,
  imports: [],
  templateUrl: './gestionar-apoderados.component.html',
  styleUrl: './gestionar-apoderados.component.css'
})
export class GestionarApoderadosComponent {
  listaApoderados = []

  constructor(
    private apoderadoService: ApoderadoService
  ) {}

  // ngOnInit() : void {
  //   this.apoderadoService.listarApoderados().subscribe(
  //     (data: any) => {
  //       this.listaApoderados = data
  //     },
  //     (error)=> {
  //       console.log(error)
  //     }
  //   )
  // }
}
