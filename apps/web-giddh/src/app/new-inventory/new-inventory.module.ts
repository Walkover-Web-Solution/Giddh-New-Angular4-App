import { NgModule } from '@angular/core';
import { NewInventoryComponent } from './new-inventory.component';
import { NewInventoryRoutingModule } from './new-inventory.routing.module';
import { SharedModule } from '../shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NewInventoryGroupComponent } from './component/inventory-group/inventory-group.component';
import { CreateNewInventoryComponent } from './component/create-new-inventory/create-new-inventory.component';
import { InventoryCreateGroupComponent } from './component/create-group/create-group.component';
import { CreateNewGroupComponent } from './component/create-new-group/create-new-group.component';
import { CreateNewItemComponent } from './component/create-new-item/create-new-item.component';
@NgModule({
    declarations: [
        NewInventoryComponent,
        NewInventoryGroupComponent,
        CreateNewInventoryComponent,
        InventoryCreateGroupComponent,
        CreateNewGroupComponent,
        CreateNewItemComponent
    ],
    imports:[
        NewInventoryRoutingModule,
        SharedModule,
        TabsModule,
        BsDropdownModule.forRoot()
    ],
    exports: [
        NewInventoryComponent,
        NewInventoryGroupComponent,
        CreateNewInventoryComponent,
        InventoryCreateGroupComponent,
        CreateNewGroupComponent,
        CreateNewItemComponent
    ]
})
export class NewInventoryModule { }
