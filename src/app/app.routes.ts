import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { LoginComponent } from './login';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent }
];
