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
import { CreateNewUnitComponent } from './component/create-unit/create-unit.component';
import { AboutGroupDetailComponent } from './component/about-group-detail/about-group-detail.component';
import { NewInventorySidebar } from './component/new-inventory-sidebar/new-inventory-sidebar.component';
import { StockGroupListComponent } from './component/stock-group-list/stock-group-list.component'
import { ProductServiceListComponent } from './component/inventory-product-service-list/inventory-product-service-list.component';
import { AboutProductServiceDetailComponent } from './component/about-product-service-detail/about-product-service-detail.component';
@NgModule({
    declarations: [
        NewInventoryComponent,
        NewInventoryGroupComponent,
        CreateNewInventoryComponent,
        InventoryCreateGroupComponent,
        CreateNewGroupComponent,
        CreateNewItemComponent,
        CreateNewUnitComponent,
        AboutGroupDetailComponent,
        NewInventorySidebar,
        StockGroupListComponent,
        ProductServiceListComponent,
        AboutProductServiceDetailComponent
    ],
    imports:[
        NewInventoryRoutingModule,
        SharedModule,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot()
    ],
    exports: [
        NewInventoryComponent,
        NewInventoryGroupComponent,
        CreateNewInventoryComponent,
        InventoryCreateGroupComponent,
        CreateNewGroupComponent,
        CreateNewItemComponent,
        CreateNewUnitComponent,
        AboutGroupDetailComponent,
        NewInventorySidebar,
        StockGroupListComponent,
        ProductServiceListComponent,
        AboutProductServiceDetailComponent
    ]
})
export class NewInventoryModule { }
