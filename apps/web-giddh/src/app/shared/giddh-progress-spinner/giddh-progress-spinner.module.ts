import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GiddhProgressSpinnerComponent } from './giddh-progress-spinner.component';

@NgModule({
    declarations: [
        GiddhProgressSpinnerComponent
    ],
    imports: [
        CommonModule,
        MatProgressSpinnerModule
    ],
    exports: [
        GiddhProgressSpinnerComponent
    ]
})
export class GiddhProgressSpinnerModule { }
