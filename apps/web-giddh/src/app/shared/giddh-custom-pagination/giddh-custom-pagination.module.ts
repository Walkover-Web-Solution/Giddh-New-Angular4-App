import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiddhCustomPaginationComponent } from './giddh-custom-pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonToggleModule
    ],
    exports: [
        GiddhCustomPaginationComponent
    ],
    declarations: [GiddhCustomPaginationComponent]
})
export class GiddhCustomPaginationModule { }
