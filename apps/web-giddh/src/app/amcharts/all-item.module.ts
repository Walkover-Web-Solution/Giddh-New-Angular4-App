import { NgModule } from '@angular/core';
import { AllItemRoutingModule } from './all-item.routing.module';
import { ChartComponent } from './all-item.component';

@NgModule({
    declarations: [
        ChartComponent
    ],
    imports: [
        AllItemRoutingModule,
    ],
    exports: [
        ChartComponent
    ]
})
export class ChartModule { }