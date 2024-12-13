import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CursoOferta } from '../../../../models/cursoOferta';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.scss'
})
export class CursosComponent {
  public lineas: CursoOferta[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.lineas = data.lineas;
  }
}
