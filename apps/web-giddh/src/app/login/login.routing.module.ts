import { LoginComponent } from './login.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserAuthenticated } from '../decorators/UserAuthenticated';

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
export class LoginRoutingModule {
}
