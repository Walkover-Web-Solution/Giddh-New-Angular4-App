import { SignupComponent } from './signup.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserAuthenticated } from '../decorators/UserAuthenticated';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: SignupComponent, canActivate: [UserAuthenticated]
            }
        ])
    ],
    exports: [RouterModule]
})
export class SignupRoutingModule {
}
