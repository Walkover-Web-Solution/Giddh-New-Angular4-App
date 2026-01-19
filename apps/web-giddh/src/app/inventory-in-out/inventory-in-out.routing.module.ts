import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventoryInOutComponent } from './inventory-in-out.component';

/**
 * Handles NgModule functionality
 */
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
/**
 * InventoryInOutRoutingModule module
 * Implements InventoryInOutRoutingModule functionality
 */
export class InventoryInOutRoutingModule {
}
