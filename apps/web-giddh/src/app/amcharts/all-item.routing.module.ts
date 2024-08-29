import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartComponent } from './all-item.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ChartComponent }
        ])
    ],

    exports: [RouterModule]


})
export class AllItemRoutingModule {
}
