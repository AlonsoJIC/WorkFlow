import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EstudianteService } from '../../../../services/estudiante.service';
import { TipoIdentificacionService } from '../../../../services/tipoIdentificacion.service';
import { TipoIdentificacion } from '../../../../models/tipoIdentificacion';
import Swal from 'sweetalert2';
import { Estudiante } from '../../../../models/estudiante';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-actualizar-estudiante',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MatProgressBarModule, MatDatepickerModule],
  templateUrl: './actualizar-estudiante.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './actualizar-estudiante.component.scss'
})
export class ActualizarEstudianteComponent implements AfterViewInit, OnInit {
  // Definir variables globales del componente.
  public idEstudiante: number = 0;
  private estado: boolean = false;
  public cargando: boolean = false;
  public tiposArr: TipoIdentificacion[] = [];

  // Definir los campos del formulario.
  public tipoIdentificacion: FormControl;
  public identificacion: FormControl;
  public nombre: FormControl;
  public apellidos: FormControl;
  public correo: FormControl;
  public telefono: FormControl;
  public fechaNacimiento: FormControl;
  public direccion: FormControl;

  // Definir el formulario.
  public formulario: FormGroup;

  constructor(
    private servicio: EstudianteService,
    private router: Router,
    private tipos: TipoIdentificacionService,
    private activeRoute: ActivatedRoute
  ) {
    this.tipoIdentificacion = new FormControl('', Validators.required);
    this.identificacion = new FormControl('', Validators.required);
    this.nombre = new FormControl('', Validators.required);
    this.apellidos = new FormControl('', Validators.required);
    this.correo = new FormControl('', Validators.required);
    this.telefono = new FormControl('', Validators.required);
    this.fechaNacimiento = new FormControl('', Validators.required);
    this.direccion = new FormControl('');

    this.formulario = new FormGroup({
      tipoIdentificacion: this.tipoIdentificacion,
      identificacion: this.identificacion,
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      telefono: this.telefono,
      fechaNacimiento: this.fechaNacimiento,
      direccion: this.direccion
    });
  }

  ngOnInit(): void {
    // Obetener el Id que viene en la URL.
    if (this.activeRoute.snapshot.paramMap.get('id') != null && this.activeRoute.snapshot.paramMap.get('id') != '0' &&
      typeof this.activeRoute.snapshot.paramMap.get('id') != 'undefined') {
      this.idEstudiante = parseInt(this.activeRoute.snapshot.paramMap.get('id')!);
    } else {
      this.router.navigate(['/estudiantes']);
    }
  }

  ngAfterViewInit(): void {
    // Cargamos los tipos de identificación para nuestro select.
    this.tipos.Listar().subscribe({
      next: (resp: TipoIdentificacion[]) => {
        this.tiposArr = resp;
      }
    });

    // Cargamos el estudiante.
    this.servicio.Consultar(this.idEstudiante).subscribe({
      next: (resp: Estudiante) => {
        this.tipoIdentificacion.setValue(resp.tipoIdentificacion.idTipoIdentificacion);
        this.identificacion.setValue(resp.identificacion);
        this.nombre.setValue(resp.nombre);
        this.apellidos.setValue(resp.apellidos);
        this.correo.setValue(resp.correo);
        this.telefono.setValue(resp.telefono);
        this.fechaNacimiento.setValue(new Date(resp.fechaNacimiento));
        this.direccion.setValue(resp.direccion);
        this.estado = resp.estado;
      }
    });
  }

  public Guardar(): void {
    // Cambiamos el estado.
    this.cargando = true;

    const estudiante = {
      idEstudiante: this.idEstudiante,
      tipoIdentificacion: {
        idTipoIdentificacion: this.tipoIdentificacion.value
      } as TipoIdentificacion,
      identificacion: this.identificacion.value,
      nombre: this.nombre.value,
      apellidos: this.apellidos.value,
      correo: this.correo.value,
      telefono: this.telefono.value,
      fechaNacimiento: new Date(this.fechaNacimiento.value),
      direccion: this.direccion.value,
      estado: this.estado
    } as Estudiante;

    this.servicio.Actualizar(estudiante).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se actualizó correctamente el estudiante.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo actualizar el estudiante, intente nuevamente.",
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
        this.router.navigate(['/estudiantes']);
      }
    });
  }
}
