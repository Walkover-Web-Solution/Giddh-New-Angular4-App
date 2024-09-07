import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AmChartComponent } from './amchart-template.component';

@NgModule({
    declarations: [AmChartComponent],
    imports: [CommonModule],
    exports: [AmChartComponent],
    providers: []
})
export class AmChartComponentModule { }
