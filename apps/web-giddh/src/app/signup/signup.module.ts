import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { SignupRoutingModule } from './signup.routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { PasswordVisibilityInputComponent } from '../shared/password-visibility-input/password-visibility-input.component';

@NgModule({
    imports: [
        MatButtonModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SignupRoutingModule,
        LaddaModule.forRoot({ style: 'slide-left', spinnerSize: 30 }),
        SharedModule,
        FormFieldsModule,
        PasswordVisibilityInputComponent
    ],
    declarations: [
        SignupComponent
    ]
})
export class SignupModule {}
