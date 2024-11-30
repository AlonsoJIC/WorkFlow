import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home/home.component';
import { NotFoundComponent } from './modules/home/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { RedirectGuard } from './guards/redirect.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '',
        canActivate: [RedirectGuard],
        loadChildren: () => import('./modules/auth/auth-routing.module').then((m) => m.AuthRoutingModule),
    },
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/dashboard/app.routes').then((m) => m.DashboardRoutingModule),
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'not-found',
        component: NotFoundComponent
    },
    //RENDERIZA LA PAGE NOTFOUND.... SIEMPRE VA DE ULTIMO PORQUE INTERFIERE!....
    {
        path: '**',
        component: NotFoundComponent
    },
];
