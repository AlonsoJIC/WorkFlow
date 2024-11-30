import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CursoService } from '../../../../services/curso.service';
import { Router, RouterModule } from '@angular/router';
import { Curso } from '../../../../models/curso';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guardar-curso',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './guardar-curso.component.html',
  styleUrl: './guardar-curso.component.scss'
})
export class GuardarCursoComponent {
  // Definir variables globales del componente.
  public cargando: boolean = false;

  // Definir los campos del formulario.
  public nombre: FormControl;
  public codigo: FormControl;
  public descripcion: FormControl;

  // Definir el formulario.
  public formulario: FormGroup;

  constructor(private servicio: CursoService, private router: Router) {
    this.nombre = new FormControl('', Validators.required);
    this.codigo = new FormControl('', Validators.required);
    this.descripcion = new FormControl('');
    this.formulario = new FormGroup({
      nombre: this.nombre,
      codigo: this.codigo,
      descripcion: this.descripcion
    });
  }

  public Guardar(): void {
    // Cambiamos el estado.
    this.cargando = true;

    // Creamos el objeto que vamos a enviar al API.
    const curso = {
      idCurso: 0,
      nombre: this.nombre.value,
      codigo: this.codigo.value,
      descripcion: this.descripcion.value,
      estado: true
    } as Curso;

    // Invocar el servicio para interactuar con el API.
    this.servicio.Guardar(curso).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se guardó correctamente el curso.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo guardar el curso, intente nuevamente.",
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
