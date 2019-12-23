import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventoryInOutComponent } from './inventory-in-out.component';
import { InventoryInOutReportComponent } from './components/inventory-in-out-report/inventory-in-out-report.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: InventoryInOutComponent,
                children: [
                    { path: ':type/:uniqueName', component: InventoryInOutReportComponent },
                ]
            }

        ])
    ],
    exports: [RouterModule]
})
export class InventoryInOutRoutingModule {
}
