import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EstudianteService } from '../../../../services/estudiante.service';
import { TipoIdentificacionService } from '../../../../services/tipoIdentificacion.service';
import { TipoIdentificacion } from '../../../../models/tipoIdentificacion';
import Swal from 'sweetalert2';
import { Estudiante } from '../../../../models/estudiante';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-guardar-estudiante',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MatProgressBarModule, MatDatepickerModule],
  templateUrl: './guardar-estudiante.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './guardar-estudiante.component.scss'
})
export class GuardarEstudianteComponent implements AfterViewInit {
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
  public fechaNacimiento: FormControl;
  public direccion: FormControl;

  // Definir el formulario.
  public formulario: FormGroup;

  constructor(private servicio: EstudianteService, private router: Router, private tipos: TipoIdentificacionService) {
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

    const estudiante = {
      idEstudiante: 0,
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
      estado: true
    } as Estudiante;

    this.servicio.Guardar(estudiante).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se guardó correctamente el estudiante.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo guardar el estudiante, intente nuevamente.",
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
