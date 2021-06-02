import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventoryInOutComponent } from './inventory-in-out.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: InventoryInOutComponent
            }
        ])
    ],
    exports: [RouterModule]
})
export class InventoryInOutRoutingModule {
}
