import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CursoService } from '../../../../services/curso.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Curso } from '../../../../models/curso';
import Swal from 'sweetalert2';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-actualizar-curso',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MatProgressBarModule],
  templateUrl: './actualizar-curso.component.html',
  styleUrl: './actualizar-curso.component.scss'
})
export class ActualizarCursoComponent implements OnInit, AfterViewInit {
  // Definir variables globales del componente.
  public idCurso: number = 0;
  private estado: boolean = false;
  public cargando: boolean = false;

  // Definir los campos del formulario.
  public nombre: FormControl;
  public codigo: FormControl;
  public descripcion: FormControl;

  public formulario: FormGroup;

  constructor(private servicio: CursoService, private router: Router, private activeRoute: ActivatedRoute) {
    this.nombre = new FormControl('', Validators.required);
    this.codigo = new FormControl('', Validators.required);
    this.descripcion = new FormControl('');
    this.formulario = new FormGroup({
      nombre: this.nombre,
      codigo: this.codigo,
      descripcion: this.descripcion
    });
  }

  ngOnInit(): void {
    // Obetener el Id que viene en la URL.
    if (this.activeRoute.snapshot.paramMap.get('id') != null && this.activeRoute.snapshot.paramMap.get('id') != '0' &&
      typeof this.activeRoute.snapshot.paramMap.get('id') != 'undefined') {
      this.idCurso = parseInt(this.activeRoute.snapshot.paramMap.get('id')!);
    } else {
      this.router.navigate(['/cursos']);
    }
  }

  ngAfterViewInit(): void {
    this.servicio.Consultar(this.idCurso).subscribe({
      next: (curso: Curso) => {
        this.nombre.setValue(curso.nombre);
        this.codigo.setValue(curso.codigo);
        this.descripcion.setValue(curso.descripcion);
        this.estado = curso.estado;
      }
    });
  }

  public Guardar(): void {
    // Cambiamos el estado.
    this.cargando = true;

    // Creamos el objeto que vamos a enviar al API.
    const curso = {
      idCurso: this.idCurso,
      nombre: this.nombre.value,
      codigo: this.codigo.value,
      descripcion: this.descripcion.value,
      estado: this.estado
    } as Curso;

    // Invocar el servicio para interactuar con el API.
    this.servicio.Actualizar(curso).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se actualizó correctamente el curso.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo actualizar el curso, intente nuevamente.",
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
        this.router.navigate(['/cursos']);
      }
    });
  }
}