import { PageComponent } from '../page.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ChildHomeComponent } from './components';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'home', redirectTo: 'pages/home', pathMatch: 'full', canActivate: [NeedsAuthentication] },
      {
        path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
        children: [
          { path: 'home', component: HomeComponent, canActivate: [NeedsAuthentication] }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
