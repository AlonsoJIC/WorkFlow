import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TokenService } from '../../services/token.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isAuthenticated: boolean = false; // Define la propiedad

  constructor(private tokenService: TokenService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.tokenService.isValidToken();
    console.log('Usuario autenticado:', this.isAuthenticated);
  }
}