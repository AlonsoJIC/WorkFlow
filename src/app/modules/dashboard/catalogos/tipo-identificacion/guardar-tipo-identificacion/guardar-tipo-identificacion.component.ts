import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TipoIdentificacionService } from '../../../../../services/tipoIdentificacion.service';
import { TipoIdentificacion } from '../../../../../models/tipoIdentificacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guardar-tipo-identificacion',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './guardar-tipo-identificacion.component.html',
  styleUrl: './guardar-tipo-identificacion.component.scss'
})
export class GuardarTipoIdentificacionComponent {
  // Variables del form.
  public cargando: boolean = false;

  // Definir los campos del formulario.
  public nombre: FormControl;
  public mascara: FormControl;

  // Definir el formulario.
  public formulario: FormGroup;

  constructor(private servicio: TipoIdentificacionService, private router: Router) {
    this.nombre = new FormControl('', Validators.required);
    this.mascara = new FormControl('', Validators.required);
    this.formulario = new FormGroup({
      nombre: this.nombre,
      mascara: this.mascara
    });
  }

  public Guardar(): void {
    // Asignar el estado del efecto del botón.
    this.cargando = true;
    
    // Construir el objeto.
    const tipo = {
      idTipoIdentificacion: 0,
      nombre: this.nombre.value,
      mascara: this.mascara.value
    } as TipoIdentificacion;

    this.servicio.Guardar(tipo).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se guardó correctamente el tipo de identificación.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo guardar el tipo de identificación, intente nuevamente.",
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
        this.router.navigate(["/catalogos/tipos-identificacion"]);
      }
    });
  }
}
