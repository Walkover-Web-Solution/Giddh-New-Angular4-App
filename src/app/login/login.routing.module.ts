import { LoginComponent } from './login.component';
import { PageComponent } from '../page.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: LoginComponent, canActivate: [NeedsAuthentication]
      }
    ])
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
