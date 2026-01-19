import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login.routing.module';
import { LaddaModule } from 'angular2-ladda';
import { SharedModule } from '../shared/shared.module';
import { LoaderModule } from '../loader/loader.module';
import { MatDialogModule } from '@angular/material/dialog';
/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        MatButtonModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LoginRoutingModule,
        LaddaModule.forRoot({ style: 'slide-left', spinnerSize: 30 }),
        SharedModule,
        LoaderModule,
        MatDialogModule
    ],
    declarations: [
        LoginComponent
    ]
})
/**
 * LoginModule module
 * Implements LoginModule functionality
 */
export class LoginModule {
}
