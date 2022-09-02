import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PermissionRoutingModule } from './permission-routing-module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PermissionRoutingModule,
        BsDropdownModule.forRoot()
    ]
})
export class PermissionModule {
}
