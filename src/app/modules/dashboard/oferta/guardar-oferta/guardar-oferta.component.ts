import { AfterViewInit, Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OfertaService } from '../../../../services/oferta.service';
import { CursoService } from '../../../../services/curso.service';
import { ProfesionalService } from '../../../../services/profesional.service';
import { Curso } from '../../../../models/curso';
import { Profesional } from '../../../../models/profesional';
import { CursoOferta } from '../../../../models/cursoOferta';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Oferta } from '../../../../models/oferta';
import Swal from 'sweetalert2';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-guardar-oferta',
  standalone: true,
  imports: [MatProgressBarModule, ReactiveFormsModule, RouterModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './guardar-oferta.component.html',
  styleUrl: './guardar-oferta.component.scss'
})
export class GuardarOfertaComponent implements AfterViewInit {
  // Variables globales del componente.
  public cargando: boolean = false;
  public arrLineas: CursoOferta[] = [];

  // Arrays para mostrar contenido
  arrCursos: Curso[] = [];
  arrProfesionales: Profesional[] = [];

  // Elementos del form
  public codigo: FormControl;
  public fechaInicio: FormControl;
  public fechaFin: FormControl;
  public descripcion: FormControl;

  public formulario: FormGroup;

  constructor(
    private servicio: OfertaService,
    private servicioCurso: CursoService,
    private servicioProfesional: ProfesionalService,
    private router: Router
  ) {
    this.codigo = new FormControl('', Validators.required);
    this.fechaInicio = new FormControl('', Validators.required);
    this.fechaFin = new FormControl('', Validators.required);
    this.descripcion = new FormControl('');
    this.formulario = new FormGroup({
      codigo: this.codigo,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      descripcion: this.descripcion
    });
  }

  ngAfterViewInit(): void {
    this.servicioCurso.Listar().subscribe({
      next: (resp: Curso[]) => {
        this.arrCursos = resp;
      }
    });

    this.servicioProfesional.Listar().subscribe({
      next: (resp: Profesional[]) => {
        this.arrProfesionales = resp;
      }
    });
  }

  public Guardar(): void {
    this.cargando = true;

    const oferta = {
      idOferta: 0,
      codigo: this.codigo.value,
      fechaInicio: this.fechaInicio.value,
      fechaFin: this.fechaFin.value,
      descripcion: this.descripcion.value,
      estado: true,
      cursos: this.arrLineas
    } as Oferta;

    this.servicio.Guardar(oferta).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se guardó correctamente la oferta.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo guardar la oferta, intente nuevamente.",
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
        this.router.navigate(['/ofertas']);
      }
    });
  }

  public AgregarLinea(): void {
    this.arrLineas.push({
      idCursoOferta: this.arrLineas.length + 1,
      cupoActual: 0,
      cupoMaximo: 10,
      cupoMinimo: 5,
      numeroGrupo: 1,
      profesional: {
        idProfesional: 0
      } as Profesional,
      curso: {
        idCurso: 0
      } as Curso,
      horaFin: "",
      horaInicio: ""
    } as CursoOferta);
  }

  public EditarLinea(id: number, idProfesional: string, idCurso: string, min: string, max: string, horaInicia: string, horaFin: string): void {
    const linea = this.arrLineas.find(x => x.idCursoOferta == id);
    if (linea) {
      linea.profesional.idProfesional = Number(idProfesional);
      linea.curso.idCurso = Number(idCurso);
      linea.cupoMinimo = Number(min);
      linea.cupoMaximo = Number(max);
      linea.horaInicio = horaInicia;
      linea.cupoActual = linea.cupoMaximo;
      linea.horaFin = horaFin;
    }
  }

  public EliminarLinea(id: number): void {
    this.arrLineas.splice(this.arrLineas.findIndex(x => x.idCursoOferta == id))
  }
}
