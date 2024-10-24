import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home/home.component';
import { NotFoundComponent } from './modules/home/not-found/not-found.component';
import { DashboardComponent } from './modules/dashboard/dashboard/dashboard.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';

export const routes: Routes = [
    {
      path: 'auth',
      // canActivate: [AuthGuard],
      loadChildren: async () =>
        (await import('./modules/auth/auth-routing.module')).routes,
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'not-found',
        component: HomeComponent
    },
    // {
    //     path: 'login',
    //     component: LoginComponent
    // },
    // {
    //     path: 'register',
    //     component: RegisterComponent
    // },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },

      //RENDERIZA LA PAGE NOTFOUND.... SIEMPRE VA DE ULTIMO PORQUE INTERFIERE!....
    {
    path: '**',
    component: NotFoundComponent
    },
];
