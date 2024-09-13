import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { D3TreeChartComponent } from "./d3-tree-chart.component";

@NgModule({
    declarations: [
        D3TreeChartComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        D3TreeChartComponent
    ]
})

export class D3TreeChartModule {

}
