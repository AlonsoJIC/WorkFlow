import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';


/* import { SharedModule } from '@shared/shared.module'; */


import { LoginComponent } from './../auth/login/login.component';
import { RegisterComponent } from './../auth/register/register.component';
import { RecoveryComponent } from './../auth/recovery/recovery.component';
import { ForgotPasswordComponent } from './../auth/forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    RecoveryComponent,
  ],
  imports: [
    CommonModule,
/*     SharedModule, */
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
