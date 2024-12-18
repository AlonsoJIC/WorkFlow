import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { OrdenTrabajoLinea } from '../../../../models/ordentrabajolinea';

@Component({
  selector: 'app-lineas-ordentrabajo',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './lineas-ordentrabajo.component.html',
  styleUrls: ['./lineas-ordentrabajo.component.css']
})
export class LineasOrdentrabajoComponent {
  public lineas: OrdenTrabajoLinea[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.lineas = data.lineas;
  }
}
