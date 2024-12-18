import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TareaService } from '../../../../services/tarea.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tarea } from '../../../../models/tarea';
import Swal from 'sweetalert2';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-actualizar-tarea',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MatProgressBarModule],
  templateUrl: './actualizar-tarea.component.html',
  styleUrl: './actualizar-tarea.component.css'
})
export class ActualizarTareaComponent implements OnInit, AfterViewInit {
  // Definir variables globales del componente.
  public idTarea: number = 0;
  private estado: boolean = false;
  public cargando: boolean = false;

  // Definir los campos del formulario.
  public nombre: FormControl;
  public horaInicio: FormControl;
  public horaFin: FormControl;
  public descripcion: FormControl;

  public formulario: FormGroup;

  constructor(private servicio: TareaService, private router: Router, private activeRoute: ActivatedRoute) {
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

  ngOnInit(): void {
    // Obetener el Id que viene en la URL.
    if (this.activeRoute.snapshot.paramMap.get('id') != null && this.activeRoute.snapshot.paramMap.get('id') != '0' &&
      typeof this.activeRoute.snapshot.paramMap.get('id') != 'undefined') {
      this.idTarea = parseInt(this.activeRoute.snapshot.paramMap.get('id')!);
    } else {
      this.router.navigate(['/dashboard/tareas']);
    }
  }

  ngAfterViewInit(): void {
    this.servicio.Consultar(this.idTarea).subscribe({
      next: (tarea: Tarea) => {
        this.nombre.setValue(tarea.nombre);
        this.horaInicio.setValue(tarea.horaInicio);
        this.horaFin.setValue(tarea.horaFin);
        this.descripcion.setValue(tarea.descripcion);
        this.estado = tarea.estado;
      }
    });
  }

  public Guardar(): void {
    // Cambiamos el estado.
    this.cargando = true;

    // Creamos el objeto que vamos a enviar al API.
    const tarea = {
      idTarea: this.idTarea,
      nombre: this.nombre.value,
      horaInicio: this.horaInicio.value,
      horaFin: this.horaFin.value,
      descripcion: this.descripcion.value,
      estado: this.estado
    } as Tarea;

    // Invocar el servicio para interactuar con el API.
    this.servicio.Actualizar(tarea).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se actualizó correctamente la tarea.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo actualizar la tarea, intente nuevamente.",
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