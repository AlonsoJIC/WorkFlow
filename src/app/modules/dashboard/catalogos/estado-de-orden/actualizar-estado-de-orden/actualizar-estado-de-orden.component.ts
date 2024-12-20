import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EstadoOrden } from '../../../../../models/estadodeorden';
import { EstadoOrdenService } from '../../../../../services/estadodeorden.service';

@Component({
  selector: 'app-actualizar-estado-de-orden',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './actualizar-estado-de-orden.component.html',
  styleUrl: './actualizar-estado-de-orden.component.css'
})
export class ActualizarEstadoOrdenComponent implements AfterViewInit, OnInit {
  // Variables componente.
  private idEstadoOrden: number = 0;

  // Variables del form.
  public cargando: boolean = false;

  // Definir los campos del formulario.
  public nombre: FormControl;

  // Definir el formulario.
  public formulario: FormGroup;

  constructor(private servicio: EstadoOrdenService, private router: Router, private activeRoute: ActivatedRoute) {
    this.nombre = new FormControl('', Validators.required);
    this.formulario = new FormGroup({
      nombre: this.nombre,
    });
  }

  ngAfterViewInit(): void {
    this.servicio.Consultar(this.idEstadoOrden).subscribe({
      next: (estado: EstadoOrden) => {
        this.nombre.setValue(estado.nombre);
      }
    });
  }

  ngOnInit(): void {
    // Obetener el Id que viene en la URL.
    if (this.activeRoute.snapshot.paramMap.get('id') != null && this.activeRoute.snapshot.paramMap.get('id') != '0' &&
      typeof this.activeRoute.snapshot.paramMap.get('id') != 'undefined') {
      this.idEstadoOrden = parseInt(this.activeRoute.snapshot.paramMap.get('id')!);
    } else {
      this.router.navigate(['/dashboard/catalogos/ordenes-estado']);
    }
  }

  public Guardar(): void {
    // Asignar el estado del efecto del botón.
    this.cargando = true;

    // Construir el objeto.
    const estado = {
      idEstadoOrden: this.idEstadoOrden,
      nombre: this.nombre.value,
    } as EstadoOrden;

    this.servicio.Actualizar(estado).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se actualizó correctamente el estado de la orden.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo actualizar el estado de la orden, intente nuevamente.",
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
        this.router.navigate(["/dashboard/catalogos/ordenes-estado"]);
      }
    });
  }
}
