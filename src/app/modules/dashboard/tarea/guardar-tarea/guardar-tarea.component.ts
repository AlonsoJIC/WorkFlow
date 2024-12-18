import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TareaService } from '../../../../services/tarea.service';
import { Router, RouterModule } from '@angular/router';
import { Tarea } from '../../../../models/tarea';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-guardar-tarea',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './guardar-tarea.component.html',
  styleUrl: './guardar-tarea.component.css'
})
export class GuardarTareaComponent {
  // Definir variables globales del componente.
  public cargando: boolean = false;

  // Definir los campos del formulario.
  public nombre: FormControl;
  public horaInicio: FormControl;
  public horaFin: FormControl;
  public descripcion: FormControl;

  // Definir el formulario.
  public formulario: FormGroup;

  constructor(private servicio: TareaService, private router: Router) {
    this.nombre = new FormControl('', Validators.required);
    this.horaInicio = new FormControl('', Validators.required);
    this.horaFin = new FormControl('', Validators.required);
    this.descripcion = new FormControl('');
    this.formulario = new FormGroup({
      nombre: this.nombre,
      horaInicio: this.horaInicio,
      horaFin: this.horaFin,
      descripcion: this.descripcion
    });
  }

  public Guardar(): void {
    // Cambiamos el estado.
    this.cargando = true;

    // Creamos el objeto que vamos a enviar al API.
    const tarea = {
      idTarea: 0,
      nombre: this.nombre.value,
      horaInicio: this.horaInicio.value,
      horaFin: this.horaFin.value,
      descripcion: this.descripcion.value,
      estado: true
    } as Tarea;

    // Invocar el servicio para interactuar con el API.
    this.servicio.Guardar(tarea).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se guardó correctamente la tarea.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo guardar la tarea, intente nuevamente.",
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
        this.router.navigate(['/dashboard/tareas']);
      }
    });
  }
}
