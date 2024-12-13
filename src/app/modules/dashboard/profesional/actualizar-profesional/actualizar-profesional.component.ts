import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProfesionalService } from '../../../../services/profesional.service';
import { TipoIdentificacionService } from '../../../../services/tipoIdentificacion.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoIdentificacion } from '../../../../models/tipoIdentificacion';
import { Profesional } from '../../../../models/profesional';
import Swal from 'sweetalert2';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-actualizar-profesional',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MatProgressBarModule, MatDatepickerModule],
  templateUrl: './actualizar-profesional.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './actualizar-profesional.component.scss'
})
export class ActualizarProfesionalComponent implements OnInit, AfterViewInit {
  // Definir variables globales del componente.
  public idProfesional: number = 0;
  private estado: boolean = false;
  public cargando: boolean = false;
  public arrTiposIdentificacion: TipoIdentificacion[] = [];

  // Definir los campos del formulario.
  public identificacion: FormControl;
  public tipoIdentificacion: FormControl;
  public nombre: FormControl;
  public apellidos: FormControl;
  public fechaNacimiento: FormControl;
  public correo: FormControl;
  public telefono: FormControl;
  public especialidad: FormControl;
  public direccion: FormControl;

  // Definir el formulario.
  public formulario: FormGroup;

  constructor(
    private servicio: ProfesionalService,
    private servicioTipoIdentificacion: TipoIdentificacionService,
    private router: Router,
    private activeRoute: ActivatedRoute) {
    this.identificacion = new FormControl('', Validators.required);
    this.tipoIdentificacion = new FormControl('', Validators.required);
    this.nombre = new FormControl('', Validators.required);
    this.apellidos = new FormControl('', Validators.required);
    this.fechaNacimiento = new FormControl('', Validators.required);
    this.correo = new FormControl('', Validators.required);
    this.telefono = new FormControl('', Validators.required);
    this.especialidad = new FormControl('', Validators.required);
    this.direccion = new FormControl('');
    this.formulario = new FormGroup({
      identificacion: this.identificacion,
      tipoIdentificacion: this.tipoIdentificacion,
      nombre: this.nombre,
      apellidos: this.apellidos,
      fechaNacimiento: this.fechaNacimiento,
      correo: this.correo,
      telefono: this.telefono,
      especialidad: this.especialidad,
      direccion: this.direccion
    });
  }

  ngOnInit(): void {
    // Obetener el Id que viene en la URL.
    if (this.activeRoute.snapshot.paramMap.get('id') != null && this.activeRoute.snapshot.paramMap.get('id') != '0' &&
      typeof this.activeRoute.snapshot.paramMap.get('id') != 'undefined') {
      this.idProfesional = parseInt(this.activeRoute.snapshot.paramMap.get('id')!);
    } else {
      this.router.navigate(['/profesionales']);
    }
  }

  ngAfterViewInit(): void {
    this.servicioTipoIdentificacion.Listar().subscribe({
      next: (resp: TipoIdentificacion[]) => {
        this.arrTiposIdentificacion = resp;
      }
    });

    this.servicio.Consultar(this.idProfesional).subscribe({
      next: (resp: Profesional) => {
        this.nombre.setValue(resp.nombre);
        this.apellidos.setValue(resp.apellidos);
        this.correo.setValue(resp.correo);
        this.direccion.setValue(resp.direccion);
        this.especialidad.setValue(resp.especialidad);
        this.fechaNacimiento.setValue(resp.fechaNacimiento);
        this.identificacion.setValue(resp.identificacion);
        this.direccion.setValue(resp.direccion);
        this.telefono.setValue(resp.telefono);
        this.tipoIdentificacion.setValue(resp.tipoIdentificacion.idTipoIdentificacion);
        this.estado = resp.estado;
      }
    });
  }

  public Guardar(): void {
    // Cambiamos el estado.
    this.cargando = true;

    // Creamos el objeto que vamos a enviar al API.
    const profesional = {
      idProfesional: this.idProfesional,
      tipoIdentificacion: {
        idTipoIdentificacion: this.tipoIdentificacion.value
      } as TipoIdentificacion,
      identificacion: this.identificacion.value,
      nombre: this.nombre.value,
      apellidos: this.apellidos.value,
      fechaNacimiento: new Date(this.fechaNacimiento.value),
      correo: this.correo.value,
      telefono: this.telefono.value,
      especialidad: this.especialidad.value,
      direccion: this.direccion.value,
      estado: this.estado
    } as Profesional;

    // Invocar el servicio para interactuar con el API.
    this.servicio.Actualizar(profesional).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se actualizó correctamente el profesional.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo actualizar el profesional, intente nuevamente.",
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
        this.router.navigate(['/profesionales']);
      }
    });
  }
}
