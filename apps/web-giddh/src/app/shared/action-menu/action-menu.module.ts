import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActionMenuComponent } from './action-menu.component';

@NgModule({
    declarations: [
        ActionMenuComponent
    ],
    imports: [
        CommonModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule
    ],
    exports: [
        ActionMenuComponent
    ]
})
export class ActionMenuModule { }
