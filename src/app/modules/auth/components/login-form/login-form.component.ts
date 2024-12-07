import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { faPen, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../services/auth.service';
import { RequestStatus } from '../../../../models/request-status.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  faPen = faPen;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  status: RequestStatus = 'init';

  // Declaramos el formulario sin inicializarlo en la declaración
  form;

  constructor(
    private formBuilder: FormBuilder,  // Inyección de formBuilder en el constructor
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    // Inicializamos el formulario dentro del constructor
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]],
    });

    // Cargar parámetros del query string
    this.route.queryParamMap.subscribe(params => {
      const email = params.get('email') || '';
      if (email) {
        this.form.controls.email.setValue(email);
      }
    });
  }

  doLogin() {
    if (this.form.valid) {
      this.status = 'loading';
      const { email, password } = this.form.getRawValue();
      this.authService.login(email!, password!)
        .subscribe({
          next: () => {
            this.status = 'success';
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.status = 'failed';
          }
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
