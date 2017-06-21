import { PageComponent } from './page.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { LoginComponent } from './login';

import { DataResolver } from './app.resolver';
import { NeedsAuthentication } from './services/decorators/needsAuthentication';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
    children: [
      { path: '', component: HomeComponent, canActivate: [NeedsAuthentication] },
      { path: 'home', component: HomeComponent, canActivate: [NeedsAuthentication] },
      { path: 'about', component: AboutComponent, canActivate: [NeedsAuthentication] },
    ]
  }
];
