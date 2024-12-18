import { AfterViewInit, Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Empleado } from '../../../../models/empleado';
import { OrdenTrabajoLinea } from '../../../../models/ordentrabajolinea';
import { OrdenTrabajoService } from '../../../../services/ordentrabajo.service';
import { EmpleadoService } from '../../../../services/empleado.service';
import { Tarea } from '../../../../models/tarea';
import { OrdenTrabajo } from '../../../../models/ordentrabajo';
import { TareaService } from '../../../../services/tarea.service';
import { EstadoOrden } from '../../../../models/estadodeorden';

@Component({
  selector: 'app-guardar-ordentrabajo',
  standalone: true,
  imports: [MatProgressBarModule, MatAutocompleteModule, RouterModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './guardar-ordentrabajo.component.html',
  styleUrl: './guardar-ordentrabajo.component.css'
})
export class GuardarOrdenTrabajoComponent implements AfterViewInit {
  // Variables globales del formulario.
  public cargando: boolean = false;
  public arrTareas: OrdenTrabajoLinea[] = [];
  public tmpEmpleado!: Empleado;

  // Autocompletables.
  public TareasFiltradas!: Observable<Tarea[]>;
  public EmpleadosFiltrados!: Observable<Empleado[]>;
  public tareas: Tarea[] = [];
  public empleados: Empleado[] = [];

  // Campos del formulario.
  public empleado: FormControl;
  public descripcion: FormControl;
  public tarea: FormControl;
  public idEstadoOrden: FormControl;  // Nuevo FormControl para el estado de la orden.

  public formulario: FormGroup;

  constructor(
    private servicio: OrdenTrabajoService,
    private svTareas: TareaService,
    private svEmpleados: EmpleadoService,
    private router: Router
  ) {
    // Inicialización de los controles del formulario.
    this.tarea = new FormControl('');
    this.empleado = new FormControl('', Validators.required);
    this.descripcion = new FormControl('');
    this.idEstadoOrden = new FormControl('', Validators.required);  // Inicializando el FormControl para el estado de la orden.

    // Configuración del FormGroup.
    this.formulario = new FormGroup({
      empleado: this.empleado,
      descripcion: this.descripcion,
      idEstadoOrden: this.idEstadoOrden
    });
  }

  ngAfterViewInit(): void {
    this.svTareas.Listar().subscribe({
      next: (resp: Tarea[]) => {
        this.tareas = resp;
        this.TareasFiltradas = this.tarea.valueChanges.pipe(
          startWith(''),
          map((valor: any) => this.FiltrarTarea(valor)) // Aquí debe funcionar
        );
      }
    });

    this.svEmpleados.Listar().subscribe({
      next: (resp: Empleado[]) => {
        this.empleados = resp;
        this.EmpleadosFiltrados = this.empleado.valueChanges.pipe(
          startWith(''),
          map((valor: any) => this.FiltrarEstudiante(valor))
        );
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

  public FiltrarEstudiante(valor: any): Empleado[] {
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

  public MostrarEstudiante(empleado: Empleado): string {
    return empleado ? `${empleado.nombre} ${empleado.apellidos}` : '';
  }

  private AgregarTarea(tarea: Tarea): void {
    const existe = this.arrTareas.find(x => x.tarea.idTarea == tarea.idTarea);
    if (existe) {
      Swal.fire({
        title: "Aviso",
        text: "LA tarea que intenta ingresar, ya fue incluido en la lista.",
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
        text: "Debe ingresar uno o varias tareas para realizar la matrícula.",
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
      idOrdentrabajo: 0,
      estadoOrden: {
        idEstadoOrden: this.idEstadoOrden.value  // No puede ser 0
      } as EstadoOrden,
      empleado: this.tmpEmpleado,
      descripcion: this.descripcion.value,
      fecha: "",
      lineas: this.arrTareas
    } as OrdenTrabajo;

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
        this.router.navigate(['/dashboard/orden-de-trabajo']);
      }
    });
  }
}
