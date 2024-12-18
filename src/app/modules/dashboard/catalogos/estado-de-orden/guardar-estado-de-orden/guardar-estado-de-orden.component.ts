import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { EstadoOrdenService } from '../../../../../services/estadodeorden.service';
import { EstadoOrden } from '../../../../../models/estadodeorden';

@Component({
  selector: 'app-guardar-estado-de-orden',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './guardar-estado-de-orden.component.html',
  styleUrls: ['./guardar-estado-de-orden.component.css']
})
export class GuardarEstadoOrdenComponent {
  // Variables del form.
  public cargando: boolean = false;

  // Definir los campos del formulario.
  public nombre: FormControl;

  // Definir el formulario.
  public formulario: FormGroup;

  constructor(private servicio: EstadoOrdenService, private router: Router) {
    this.nombre = new FormControl('', Validators.required);
    this.formulario = new FormGroup({
      nombre: this.nombre,
    });
  }

  public Guardar(): void {
    // Validar el formulario antes de proceder
    if (this.formulario.invalid) {
      Swal.fire({
        title: "Error",
        text: "Por favor, complete todos los campos requeridos.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    // Asignar el estado del efecto del botón.
    this.cargando = true;

    // Construir el objeto.
    const estado = {
      idEstadoOrden: 0,
      nombre: this.nombre.value,
    } as EstadoOrden;

    this.servicio.Guardar(estado).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se guardó correctamente el Estado De Orden.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo guardar el Estado De Orden, intente nuevamente.",
            icon: "warning",
            confirmButtonText: "Aceptar"
          });
        }
      },
      error: (e: any) => {
        Swal.fire({
          title: "Aviso",
          text: `Ocurrió un error en el proceso, referencia de respuesta: ${e.message}`,
          icon: "error",
          confirmButtonText: "Aceptar"
        });
      },
      complete: () => {
        this.cargando = false;
        this.router.navigate(["/dashboard/catalogos/estado-de-orden"]);
      }
    });
  }
}