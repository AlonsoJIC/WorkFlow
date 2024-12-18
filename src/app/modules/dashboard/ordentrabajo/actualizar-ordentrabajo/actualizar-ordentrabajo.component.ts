import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrdenTrabajoLinea } from '../../../../models/ordentrabajolinea';
import { Empleado } from '../../../../models/empleado';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Tarea } from '../../../../models/tarea';
import { TareaService } from '../../../../services/tarea.service';
import { EmpleadoService } from '../../../../services/empleado.service';
import { OrdenTrabajoService } from '../../../../services/ordentrabajo.service';
import Swal from 'sweetalert2';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';
import { OrdenTrabajo } from '../../../../models/ordentrabajo';

@Component({
  selector: 'app-actualizar-ordentrabajo',
  standalone: true,
  imports: [MatProgressBarModule, MatAutocompleteModule, RouterModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './actualizar-ordentrabajo.component.html',
  styleUrls: ['./actualizar-ordentrabajo.component.css']
})
export class ActualizarOrdenTrabajoComponent implements OnInit, AfterViewInit {
  public cargando: boolean = false;
  public arrTareas: OrdenTrabajoLinea[] = [];
  public tmpEmpleado!: Empleado;
  private idOrdentrabajo: number = 0;
  private estado: boolean = false;

  public TareasFiltradas!: Observable<Tarea[]>;
  public EmpleadosFiltrados!: Observable<Empleado[]>;
  public tareas: Tarea[] = [];
  public empleados: Empleado[] = [];

  public empleado: FormControl;
  public descripcion: FormControl;
  public fecha: FormControl;
  public tarea: FormControl;

  public formulario: FormGroup;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private servicio: OrdenTrabajoService,
    private svTareas: TareaService,
    private svEmpleados: EmpleadoService,
  ) {
    this.tarea = new FormControl('');

    this.empleado = new FormControl('', Validators.required);
    this.descripcion = new FormControl('');
    this.fecha = new FormControl('');
    this.formulario = new FormGroup({
      empleado: this.empleado,
      descripcion: this.descripcion,
      fecha: this.fecha
    });
  }

  ngOnInit(): void {
    if (this.activeRoute.snapshot.paramMap.get('id') != null && this.activeRoute.snapshot.paramMap.get('id') != '0' &&
      typeof this.activeRoute.snapshot.paramMap.get('id') != 'undefined') {
      this.idOrdentrabajo = parseInt(this.activeRoute.snapshot.paramMap.get('id')!);
    } else {
      this.router.navigate(['/dashboard/ordentrabajo']);
    }
  }

  ngAfterViewInit(): void {
    this.svTareas.Listar().subscribe({
      next: (resp: Tarea[]) => {
        this.tareas = resp;
        this.TareasFiltradas = this.tarea.valueChanges.pipe(
          startWith(''),
          map((valor: any) => this.FiltrarTarea(valor))
        );
      }
    });

    this.svEmpleados.Listar().subscribe({
      next: (resp: Empleado[]) => {
        this.empleados = resp;
        this.EmpleadosFiltrados = this.empleado.valueChanges.pipe(
          startWith(''),
          map((valor: any) => this.FiltrarEmpleado(valor))
        );
      }
    });

    this.servicio.Consultar(this.idOrdentrabajo).subscribe({
      next: (resp: OrdenTrabajo) => {
        this.empleado.setValue(resp.empleado);
        this.descripcion.setValue(resp.descripcion);
        this.arrTareas = resp.lineas;
        this.tmpEmpleado = resp.empleado;
      }
    });
  }

  public FiltrarTarea(valor: any): Tarea[] {
    let nombre = '';

    if (typeof valor == 'object') {
      this.AgregarTarea(valor as Tarea);
    }

    if (typeof valor == 'string') {
      nombre = valor.toLowerCase().trim();
    }

    return this.tareas.filter(x => x.nombre.toLowerCase().includes(nombre));
  }

  public FiltrarEmpleado(valor: any): Empleado[] {
    let nombre = '';

    if (typeof valor == 'object') {
      this.tmpEmpleado = valor as Empleado;
    }

    if (typeof valor == 'string') {
      nombre = valor.toLowerCase().trim();
    }

    return this.empleados.filter(x => x.nombre.toLowerCase().includes(nombre));
  }

  public MostrarTarea(tarea: Tarea): string {
    return tarea != null ? tarea.nombre : '';
  }

  public MostrarEmpleado(empleado: Empleado): string {
    return empleado ? `${empleado.nombre} ${empleado.apellidos}` : '';
  }

  private AgregarTarea(tarea: Tarea): void {
    const existe = this.arrTareas.find(x => x.tarea.idTarea == tarea.idTarea);
    if (existe) {
      Swal.fire({
        title: "Aviso",
        text: "La tarea que intenta ingresar, ya fue incluida en la lista.",
        icon: "info",
        confirmButtonText: "Aceptar"
      });
    } else {
      const linea = {
        idOrdenTrabajoLinea: 0,
        tarea: tarea
      } as OrdenTrabajoLinea;
      this.arrTareas.push(linea);
      this.tarea.setValue('');
    }
  }

  public EliminarTarea(idTarea: number): void {
    const curso = this.arrTareas.findIndex(x => x.tarea.idTarea == idTarea);
    this.arrTareas.splice(curso, 1);
  }

  public Guardar(): void {
    if (this.arrTareas.length == 0) {
      Swal.fire({
        title: "Aviso",
        text: "Debe ingresar una o varias tareas para realizar la matrícula.",
        icon: "info",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    if (!this.tmpEmpleado) {
      Swal.fire({
        title: "Aviso",
        text: "Debe ingresar un empleado para realizar la orden de trabajo.",
        icon: "info",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    this.cargando = true;

    const ordentrabajo = {
      idOrdenTrabajo: 0,
      estado: true,
      empleado: this.tmpEmpleado,
      descripcion: this.descripcion.value,
      fecha: '',
      lineas: this.arrTareas
    } as unknown as OrdenTrabajo;

    this.servicio.Guardar(ordentrabajo).subscribe({
      next: (resp: boolean) => {
        if (resp) {
          Swal.fire({
            title: "Aviso",
            text: "Se guardó correctamente la orden de trabajo.",
            icon: "success",
            confirmButtonText: "Aceptar"
          });
        } else {
          Swal.fire({
            title: "Aviso",
            text: "No se pudo guardar la orden de trabajo, intente nuevamente.",
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
        this.router.navigate(['/dashboard/ordentrabajo']);
      }
    });
  }
}