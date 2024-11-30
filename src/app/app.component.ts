import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NgIf } from '@angular/common';
import { BackgroundComponent } from "./components/background/background.component";



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgIf, BackgroundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'WorkFlow';

  showNavbarFooter: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Aquí puedes configurar las rutas donde quieres ocultar el navbar y footer
        const hiddenRoutes = [/* '/login', '/register', */ '/dashboard'];
        this.showNavbarFooter = !hiddenRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
}