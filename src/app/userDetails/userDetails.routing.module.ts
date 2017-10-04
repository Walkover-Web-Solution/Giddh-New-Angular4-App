import { PageComponent } from '../page.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';
import { UserDetailsComponent } from './userDetails.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: UserDetailsComponent, canActivate: [NeedsAuthentication]
      }
    ])
  ],
  exports: [RouterModule]
})
export class UserDetailsRoutingModule { }
