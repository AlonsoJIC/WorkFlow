import { Component } from '@angular/core';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { FooterComponent } from "../../../components/footer/footer.component";
import { TextAnimationComponent } from "../../../components/text-animation/text-animation.component";
import { BackgroundComponent } from "../../../components/background/background.component";
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, TextAnimationComponent, BackgroundComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
