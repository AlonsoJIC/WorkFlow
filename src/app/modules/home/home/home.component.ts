import { Component } from '@angular/core';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { FooterComponent } from "../../../components/footer/footer.component";
import { TextAnimationComponent } from "../../../components/text-animation/text-animation.component";
import { BackgroundComponent } from "../../../components/background/background.component";
import { RouterLink } from "@angular/router";
import { TokenService } from '../../../services/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, NavbarComponent, FooterComponent, TextAnimationComponent, BackgroundComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isAuthenticated: boolean = false; // Define la propiedad

  constructor(private tokenService: TokenService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.tokenService.isValidToken();
    console.log('Usuario autenticado:', this.isAuthenticated);
  }
}