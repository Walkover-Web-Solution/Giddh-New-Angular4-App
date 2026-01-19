import { LoginComponent } from './login.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([ { path: '',
        component: LoginComponent }
    
        ])
    ],
    exports: [
        RouterModule
    ]
})
/**
 * LoginRoutingModule module
 * Implements LoginRoutingModule functionality
 */
export class LoginRoutingModule {
}
