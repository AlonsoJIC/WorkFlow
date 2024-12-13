import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CursoOferta } from '../../../../models/cursoOferta';
import { Curso } from '../../../../models/curso';
import { Profesional } from '../../../../models/profesional';
import { CursoService } from '../../../../services/curso.service';
import { OfertaService } from '../../../../services/oferta.service';
import { ProfesionalService } from '../../../../services/profesional.service';
import Swal from 'sweetalert2';
import { Oferta } from '../../../../models/oferta';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-actualizar-oferta',
  standalone: true,
  imports: [MatProgressBarModule, ReactiveFormsModule, RouterModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './actualizar-oferta.component.html',
  styleUrl: './actualizar-oferta.component.scss'
})
export class ActualizarOfertaComponent implements AfterViewInit, OnInit {
  // Variables globales del componente.
  public cargando: boolean = false;
  public arrLineas: CursoOferta[] = [];
  private idOferta: number = 0;
  private estado: boolean = false;

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
    private router: Router,
    private activeRoute: ActivatedRoute
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

  ngOnInit(): void {
    // Obetener el Id que viene en la URL.
    if (this.activeRoute.snapshot.paramMap.get('id') != null && this.activeRoute.snapshot.paramMap.get('id') != '0' &&
      typeof this.activeRoute.snapshot.paramMap.get('id') != 'undefined') {
      this.idOferta = parseInt(this.activeRoute.snapshot.paramMap.get('id')!);
    } else {
      this.router.navigate(['/ofertas']);
    }
  }

  ngAfterViewInit(): void {
    this.servicio.Consultar(this.idOferta).subscribe({
      next: (resp: Oferta) => {
        this.codigo.setValue(resp.codigo);
        this.fechaInicio.setValue(resp.fechaInicio);
        this.fechaFin.setValue(resp.fechaFin),
        this.descripcion.setValue(resp.descripcion);
        this.estado = resp.estado;
        this.arrLineas = resp.cursos;
      }
    });

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
      idOferta: this.idOferta,
      codigo: this.codigo.value,
      fechaInicio: this.fechaInicio.value,
      fechaFin: this.fechaFin.value,
      descripcion: this.descripcion.value,
      estado: this.estado,
      cursos: this.arrLineas
    } as Oferta;

    this.servicio.Actualizar(oferta).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se actualizó correctamente la oferta.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo actualizar la oferta, intente nuevamente.",
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
