import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LaddaModule } from 'angular2-ladda';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SignupRoutingModule } from './signup.routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SignupRoutingModule,
        ModalModule,
        LaddaModule,
        ShSelectModule
    ],
    declarations: [SignupComponent]
})
export class SignupModule {
}
