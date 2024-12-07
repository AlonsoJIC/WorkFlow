import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NgIf } from '@angular/common';
import { BackgroundComponent } from "./components/background/background.component";
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgIf, BackgroundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'WorkFlow';
  isAuthenticated = false;

  showNavbarFooter: boolean = true;
  isAuth: boolean = true;

  constructor(private router: Router, private tokenService: TokenService) {

  }

  ngOnInit() {
    const hiddenKeywords = ['dashboard', 'curso', 'catalogo', 'estudiantes', 'profesionales'];
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbarFooter = !hiddenKeywords.some(keyword => event.urlAfterRedirects.includes(keyword));
      }
    });

    this.isAuthenticated = this.tokenService.isValidToken();
    console.log('Usuario autenticado:', this.isAuthenticated);
  }
}