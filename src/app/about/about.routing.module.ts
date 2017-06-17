import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './about.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'about', redirectTo: 'pages/about', pathMatch: 'full' },
      {
        path: 'pages', children: [
          { path: 'about', component: AboutComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
