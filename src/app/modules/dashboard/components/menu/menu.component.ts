import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../../services/token.service'; // Asegúrate de que la ruta al servicio es correcta

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  constructor(
    private router: Router,
    private tokenService: TokenService // Inyectamos el TokenService
  ) {}

  logout(): void {
    // Llamamos al método logout del servicio para borrar los tokens
    this.tokenService.logout();

    // Redirigimos al usuario a la página de login
    this.router.navigate(['/login']);
  }
}
