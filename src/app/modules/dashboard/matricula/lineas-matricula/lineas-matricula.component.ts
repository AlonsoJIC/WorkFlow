import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CursoMatricula } from '../../../../models/cursoMatricula';

@Component({
  selector: 'app-lineas-matricula',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './lineas-matricula.component.html',
  styleUrl: './lineas-matricula.component.scss'
})
export class LineasMatriculaComponent {
  public lineas: CursoMatricula[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.lineas = data.lineas;
  }
}
