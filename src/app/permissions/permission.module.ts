import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PermissionRoutingModule } from './permission-routing-module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PermissionRoutingModule
    ]
})
export class PermissionModule {}
