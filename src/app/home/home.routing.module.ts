import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ChildHomeComponent } from './components';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'home', redirectTo: 'pages/home', pathMatch: 'full' },
            {
        path: 'pages', children: [
          { path: 'child-home', component: ChildHomeComponent },
        ]
      }
        ])
    ],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
