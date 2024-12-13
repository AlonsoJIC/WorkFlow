import { AfterViewInit, Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatriculaService } from '../../../../services/matricula.service';
import { OfertaService } from '../../../../services/oferta.service';
import { CursoService } from '../../../../services/curso.service';
import { Router, RouterModule } from '@angular/router';
import { CursoMatricula } from '../../../../models/cursoMatricula';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EstudianteService } from '../../../../services/estudiante.service';
import { map, Observable, startWith } from 'rxjs';
import { Curso } from '../../../../models/curso';
import { Estudiante } from '../../../../models/estudiante';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Oferta } from '../../../../models/oferta';
import { AsyncPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Matricula } from '../../../../models/matricula';

@Component({
  selector: 'app-guardar-matricula',
  standalone: true,
  imports: [MatProgressBarModule, MatAutocompleteModule, RouterModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './guardar-matricula.component.html',
  styleUrl: './guardar-matricula.component.scss'
})
export class GuardarMatriculaComponent implements AfterViewInit {
  // Variables globales del formulario.
  public cargando: boolean = false;
  public arrCursos: CursoMatricula[] = [];
  public tmpEstudiante!: Estudiante;

  // Autocompletables.
  public CursosFiltrados!: Observable<Curso[]>;
  public EstudiantesFiltrados!: Observable<Estudiante[]>;
  public cursos: Curso[] = [];
  public estudiantes: Estudiante[] = [];
  public ofertas: Oferta[] = [];

  // Campos del formulario.
  public codigo: FormControl;
  public oferta: FormControl;
  public estudiante: FormControl;
  public descripcion: FormControl;
  public curso: FormControl;

  public formulario: FormGroup;

  constructor(
    private servicio: MatriculaService,
    private svOfertas: OfertaService,
    private svCursos: CursoService,
    private svEstudiantes: EstudianteService,
    private router: Router
  ) {
    // Auto completables.
    this.curso = new FormControl('');

    this.codigo = new FormControl('', Validators.required);
    this.oferta = new FormControl('', Validators.required);
    this.estudiante = new FormControl('', Validators.required);
    this.descripcion = new FormControl('');
    this.formulario = new FormGroup({
      codigo: this.codigo,
      oferta: this.oferta,
      estudiante: this.estudiante,
      descripcion: this.descripcion
    });
  }

  ngAfterViewInit(): void {
    this.svCursos.Listar().subscribe({
      next: (resp: Curso[]) => {
        this.cursos = resp;
        this.CursosFiltrados = this.curso.valueChanges.pipe(
          startWith(''),
          map((valor: any) => this.FiltrarCurso(valor))
        );
      }
    });

    this.svEstudiantes.Listar().subscribe({
      next: (resp: Estudiante[]) => {
        this.estudiantes = resp;
        this.EstudiantesFiltrados = this.estudiante.valueChanges.pipe(
          startWith(''),
          map((valor: any) => this.FiltrarEstudiante(valor))
        );
      }
    });

    this.svOfertas.Listar().subscribe({
      next: (resp: Oferta[]) => {
        this.ofertas = resp;
      }
    });
  }

  public FiltrarCurso(valor: any): Curso[] {
    let nombre = '';

    if (typeof valor == 'object') {
      this.AgregarCurso(valor as Curso);
    }

    if (typeof valor == 'string') {
      nombre = valor.toLowerCase().trim();
    }

    return this.cursos.filter(x => x.nombre.toLowerCase().includes(nombre));
  }

  public FiltrarEstudiante(valor: any): Estudiante[] {
    let nombre = '';

    if (typeof valor == 'object') {
      this.tmpEstudiante = valor as Estudiante;
    }

    if (typeof valor == 'string') {
      nombre = valor.toLowerCase().trim();
    }

    return this.estudiantes.filter(x => x.nombre.toLowerCase().includes(nombre));
  }

  public MostrarCurso(curso: Curso): string {
    return curso != null ? curso.nombre : '';
  }

  public MostrarEstudiante(estudiante: Estudiante): string {
    return estudiante ? `${estudiante.nombre} ${estudiante.apellidos}` : '';
  }

  private AgregarCurso(curso: Curso): void {
    const existe = this.arrCursos.find(x => x.curso.idCurso == curso.idCurso);
    if (existe) {
      Swal.fire({
        title: "Aviso",
        text: "El curso que intenta ingresar, ya fue incluido en la lista.",
        icon: "info",
        confirmButtonText: "Aceptar"
      });
    } else {
      const linea = {
        idCursoMatricula: 0,
        curso: curso
      } as CursoMatricula;
      this.arrCursos.push(linea);
      this.curso.setValue('');
    }
  }

  public EliminarCurso(idCurso: number): void {
    const curso = this.arrCursos.findIndex(x => x.curso.idCurso == idCurso);
    this.arrCursos.splice(curso, 1);
  }

  public Guardar(): void {
    if (this.arrCursos.length == 0) {
      Swal.fire({
        title: "Aviso",
        text: "Debe ingresar uno o varios cursos para realizar la matrícula.",
        icon: "info",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    if (!this.tmpEstudiante) {
      Swal.fire({
        title: "Aviso",
        text: "Debe ingresar un estudiante para realizar la matrícula.",
        icon: "info",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    this.cargando = true;

    const matricula = {
      idMatricula: 0,
      estado: true,
      estudiante: this.tmpEstudiante,
      codigo: this.codigo.value,
      descripcion: this.descripcion.value,
      fecha: '',
      oferta: {
        idOferta: this.oferta.value
      } as Oferta,
      lineas: this.arrCursos
    } as Matricula;

    this.servicio.Guardar(matricula).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se guardó correctamente la matrícula.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo guardar la matrícula, intente nuevamente.",
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
        this.router.navigate(['/matriculas']);
      }
    });
  }
}
