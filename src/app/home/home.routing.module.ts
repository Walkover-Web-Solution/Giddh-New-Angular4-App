import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: HomeComponent, canActivate: [NeedsAuthentication]
      }
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
