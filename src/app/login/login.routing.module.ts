import { UserAuthenticated } from '../services/decorators/UserAuthenticated';
import { LoginComponent } from './login.component';
import { PageComponent } from '../page.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: LoginComponent, canActivate: [UserAuthenticated]
      }
    ])
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
