import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-modal-cambiar-contra',
  standalone: true,
  imports: [
    MatInputModule, 
    FormsModule, 
    MatButtonModule, 
    CommonModule, 
    MatProgressBar,
    MatIconModule
  ],
  templateUrl: './modal-cambiar-contra.component.html',
  styleUrl: './modal-cambiar-contra.component.css'
})
export class ModalCambiarContraComponent {
  loading = false
  usuarioId: any
  hide = true

  contra = {
    newPassword: ''
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalCambiarContraComponent>,
    private snack: MatSnackBar,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.usuarioId = this.data.user.usuario._id
  }

  cambiarContra() {

    // VALIDACIONES

    this.loading = true
    this.userService.modificarContrasenia(this.usuarioId, this.contra).subscribe(
      (data: any) => {
        this.snack.open('Contraseña cambiada con éxito.', 'Cerrar', {
          duration: 3000
        })
        this.loading = false
        this.closeModel()
      }
    )
  }

  closeModel() {
    this.dialogRef.close()
  }
}
