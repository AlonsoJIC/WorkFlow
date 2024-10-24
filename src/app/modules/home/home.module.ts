import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
/* import { SharedModule } from '@shared/shared.module'; */
import { HomeRoutingModule } from './home-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
/*     SharedModule, */
    ReactiveFormsModule,
  ]
})
export class HomeModule { }
