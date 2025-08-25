import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login.routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LaddaModule } from 'angular2-ladda';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SharedModule } from '../shared/shared.module';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
    imports: [
        MatButtonModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LoginRoutingModule,
        ModalModule.forRoot(),
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ShSelectModule,
        SharedModule,
        LoaderModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule {
}
