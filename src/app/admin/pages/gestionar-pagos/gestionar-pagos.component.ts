import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TableComponent } from '../../../shared/components/table/table.component';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { PagoService } from '../../../core/services/pagos.service';
import Swal from 'sweetalert2';
import { DocumentoService } from '../../../core/services/documento.service';

@Component({
  selector: 'app-gestionar-pagos',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, InputComponent, MatButtonModule],
  templateUrl: './gestionar-pagos.component.html',
  styleUrl: './gestionar-pagos.component.css'
})
export class GestionarPagosComponent {
  pagos = []
  documentos: any
  trackByField = '_id'
  loading = false
  loadedComplete: any
  searchTerm: string = ''

  columns = [
    { header: 'Monto', field: 'monto' },
    { header: 'Nombre completo', field: 'nombre_completo' },
    { header: 'Estado', field: 'status' },
    { header: 'Tipo Documento', field: 'metadata.tipoDocumento' },
    { header: 'Nro. Documento', field: 'metadata.nroDocumento' },
    { header: 'Fecha', field: 'paymentDate' }
  ]

  constructor(
    private pagoService: PagoService,
    private documentoService: DocumentoService
  ){}

  ngOnInit() {
    this.loading = true
    this.listarDocumentos()
  }

  listarDocumentos() {
    this.documentoService.listarTiposDocumento().subscribe(
      (data: any) => {
        this.documentos = this.mapearDocumentos(data); // Mapea los documentos
        this.listarPagos(); // Una vez cargados los documentos, lista los pagos
      },
      (error) => {
        this.loading = false;
        Swal.fire('Error', 'Error al cargar los documentos', 'error');
      }
    );
  }

  mapearDocumentos(data: any) {
    const map: any = {};
    data.forEach((documento: any) => {
      map[documento._id] = documento.type;
    });
    return map;
  }

  listarPagos() {
    this.pagoService.listarPagos().subscribe(
      (data: any) => {
        this.pagos = data.map((pago: any) => ({
          ...pago,
          metadata: {
            ...pago.metadata,
            tipoDocumento: this.documentos[pago.metadata.tipoDocumento] || 'Desconocido' // Si no existe, muestra 'Desconocido'
          }
        }));
        this.loading = false;
        this.loadedComplete = true;
      },
      (error) => {
        this.loading = false;
        Swal.fire('Error', 'Error al cargar los datos', 'error');
      }
    );
  }

  displayedPagos() {
    return this.pagos.filter((pago: any) => 
      pago.metadata.nroDocumento.includes(this.searchTerm)
    )
  }
}
