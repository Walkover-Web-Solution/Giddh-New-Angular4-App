import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { D3TreeChartComponent } from "./d3-tree-chart.component";

/**
 * Handles NgModule functionality
 */
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

/**
 * D3TreeChartModule module
 * Implements D3TreeChartModule functionality
 */
export class D3TreeChartModule {
}
