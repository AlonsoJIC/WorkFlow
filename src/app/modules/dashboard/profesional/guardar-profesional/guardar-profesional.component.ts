import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { ProfesionalService } from '../../../../services/profesional.service';
import { TipoIdentificacionService } from '../../../../services/tipoIdentificacion.service';
import { Profesional } from '../../../../models/profesional';
import { TipoIdentificacion } from '../../../../models/tipoIdentificacion';
import Swal from 'sweetalert2';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-guardar-profesional',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MatProgressBarModule, MatDatepickerModule],
  templateUrl: './guardar-profesional.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './guardar-profesional.component.scss'
})
export class GuardarProfesionalComponent implements AfterViewInit {
  // Definir variables globales del componente.
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

  constructor(private servicio: ProfesionalService, private servicioTipoIdentificacion: TipoIdentificacionService, private router: Router) {
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

  ngAfterViewInit(): void {
    this.servicioTipoIdentificacion.Listar().subscribe({
      next: (resp: TipoIdentificacion[]) => {
        this.arrTiposIdentificacion = resp;
      }
    });
  }

  public Guardar(): void {
    // Cambiamos el estado.
    this.cargando = true;

    // Creamos el objeto que vamos a enviar al API.
    const profesional = {
      idProfesional: 0,
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
      estado: true
    } as Profesional;

    // Invocar el servicio para interactuar con el API.
    this.servicio.Guardar(profesional).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se guardó correctamente el profesional.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo guardar el profesional, intente nuevamente.",
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
