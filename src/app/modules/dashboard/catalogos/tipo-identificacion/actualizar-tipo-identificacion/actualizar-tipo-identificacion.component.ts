import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TipoIdentificacion } from '../../../../../models/tipoIdentificacion';
import { TipoIdentificacionService } from '../../../../../services/tipoIdentificacion.service';

@Component({
  selector: 'app-actualizar-tipo-identificacion',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './actualizar-tipo-identificacion.component.html',
  styleUrl: './actualizar-tipo-identificacion.component.scss'
})
export class ActualizarTipoIdentificacionComponent implements AfterViewInit, OnInit {
  // Variables componente.
  private idTipoIdentificacion: number = 0;

  // Variables del form.
  public cargando: boolean = false;

  // Definir los campos del formulario.
  public nombre: FormControl;
  public mascara: FormControl;

  // Definir el formulario.
  public formulario: FormGroup;

  constructor(private servicio: TipoIdentificacionService, private router: Router, private activeRoute: ActivatedRoute) {
    this.nombre = new FormControl('', Validators.required);
    this.mascara = new FormControl('', Validators.required);
    this.formulario = new FormGroup({
      nombre: this.nombre,
      mascara: this.mascara
    });
  }

  ngAfterViewInit(): void {
    this.servicio.Consultar(this.idTipoIdentificacion).subscribe({
      next: (tipo: TipoIdentificacion) => {
        this.nombre.setValue(tipo.nombre);
        this.mascara.setValue(tipo.mascara);
      }
    });
  }

  ngOnInit(): void {
    // Obetener el Id que viene en la URL.
    if (this.activeRoute.snapshot.paramMap.get('id') != null && this.activeRoute.snapshot.paramMap.get('id') != '0' &&
      typeof this.activeRoute.snapshot.paramMap.get('id') != 'undefined') {
      this.idTipoIdentificacion = parseInt(this.activeRoute.snapshot.paramMap.get('id')!);
    } else {
      this.router.navigate(['/catalogos/tipos-identificacion']);
    }
  }

  public Guardar(): void {
    // Asignar el estado del efecto del botón.
    this.cargando = true;

    // Construir el objeto.
    const tipo = {
      idTipoIdentificacion: this.idTipoIdentificacion,
      nombre: this.nombre.value,
      mascara: this.mascara.value
    } as TipoIdentificacion;

    this.servicio.Actualizar(tipo).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se actualizó correctamente el tipo de identificación.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo actualizar el tipo de identificación, intente nuevamente.",
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
