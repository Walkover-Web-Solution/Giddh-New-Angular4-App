import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PermissionRoutingModule } from './permission-routing-module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PermissionRoutingModule
    ]
})
export class PermissionModule {
}
