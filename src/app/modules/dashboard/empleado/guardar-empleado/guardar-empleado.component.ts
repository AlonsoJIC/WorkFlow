import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmpleadoService } from '../../../../services/empleado.service';
import { TipoIdentificacionService } from '../../../../services/tipoIdentificacion.service';
import { TipoIdentificacion } from '../../../../models/tipoIdentificacion';
import Swal from 'sweetalert2';
import { Empleado } from '../../../../models/empleado';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
@Component({
  selector: 'app-guardar-empleado',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MatProgressBarModule, MatDatepickerModule],
  templateUrl: './guardar-empleado.component.html',
  styleUrl: './guardar-empleado.component.css'
})
export class GuardarEmpleadoComponent implements AfterViewInit {
  // Definir variables globales del componente.
  public cargando: boolean = false;
  public tiposArr: TipoIdentificacion[] = [];

  // Definir los campos del formulario.
  public tipoIdentificacion: FormControl;
  public identificacion: FormControl;
  public nombre: FormControl;
  public apellidos: FormControl;
  public correo: FormControl;
  public telefono: FormControl;
  public puesto: FormControl;
  public direccion: FormControl;

  // Definir el formulario.
  public formulario: FormGroup;

  constructor(private servicio: EmpleadoService, private router: Router, private tipos: TipoIdentificacionService) {
    this.tipoIdentificacion = new FormControl('', Validators.required);
    this.identificacion = new FormControl('', Validators.required);
    this.nombre = new FormControl('', Validators.required);
    this.apellidos = new FormControl('', Validators.required);
    this.puesto = new FormControl('', Validators.required);
    this.correo = new FormControl('', Validators.required);
    this.telefono = new FormControl('', Validators.required);
    this.direccion = new FormControl('');

    this.formulario = new FormGroup({
      tipoIdentificacion: this.tipoIdentificacion,
      identificacion: this.identificacion,
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      telefono: this.telefono,
      direccion: this.direccion,
      puesto: this.puesto,
    });
  }

  ngAfterViewInit(): void {
    // Cargamos los tipos de identificación para nuestro select.
    this.tipos.Listar().subscribe({
      next: (resp: TipoIdentificacion[]) => {
        this.tiposArr = resp;
      }
    });
  }

  public Guardar(): void {
    // Cambiamos el estado.
    this.cargando = true;

    const empleado = {
      idEmpleado: 0,
      tipoIdentificacion: {
        idTipoIdentificacion: this.tipoIdentificacion.value
      } as TipoIdentificacion,
      identificacion: this.identificacion.value,
      nombre: this.nombre.value,
      apellidos: this.apellidos.value,
      correo: this.correo.value,
      telefono: this.telefono.value,
      puesto: this.puesto.value,
      direccion: this.direccion.value,
      estado: true
    } as Empleado;

    this.servicio.Guardar(empleado).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se guardó correctamente el empleado.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo guardar el empleado, intente nuevamente.",
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
        this.router.navigate(['/dashboard/empleados']);
      }
    });
  }
}