import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NewInventoryComponent } from './new-inventory.component';
import { NewInventoryRoutingModule } from './new-inventory.routing.module';
import { SharedModule } from '../shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NewInventoryGroupComponent } from './component/inventory-group/inventory-group.component';
import { CreateNewInventoryAsideComponent } from './component/create-new-inventory-aside-pane/create-new-inventory-aside.component';
import { InventoryCreateGroupComponent } from './component/create-group/create-group.component';
import { CreateNewGroupComponent } from './component/create-new-group/create-new-group.component';
import { CreateNewItemComponent } from './component/create-new-item/create-new-item.component';
import { CreateNewUnitComponent } from './component/create-unit/create-unit.component';
import { CreateComboComponent } from './component/create-combo/create-combo.component';
import { AboutGroupDetailComponent } from './component/about-group-detail/about-group-detail.component';
import { InventoryGroupListSidebar } from './component/inventory-group-list-sidebar/inventory-group-list-sidebar.component';
import { StockGroupListComponent } from './component/stock-group-list/stock-group-list.component'
import { ProductServiceListComponent } from './component/inventory-product-service-list/inventory-product-service-list.component';
import { AboutProductServiceDetailComponent } from './component/about-product-service-detail/about-product-service-detail.component';
import { InventoryComboListComponent } from './component/combo-list/inventory-combo-list.component';
import { AboutComboDetailComponent } from './component/about-combo-detail/about-combo-detail.component';
import { InventoryTransactionListComponent } from './component/inventory-transaction-list/inventory-transaction-list.component';
import { InventoryCustomFieldComponent } from './component/inventory-custom-field/inventory-custom-field.component';
import { CreateCustomFieldComponent } from './component/create-custom-field/create-custom-field.component';
import { AdjustInventoryComponent } from './component/adjust-inventory-list/adjust-inventory-list.component';
import { AsideAdjustInventoryComponent } from './component/adjust-inventory-aside/adjust-inventory-aside.component';
import { AdjustGroupComponent } from './component/adjust-group/adjust-group.component';
import { AdjustProductServiceComponent } from './component/adjust-product-service/adjust-product-service.component';
import { InventoryAdjustmentReasonAside } from './component/inventory-adjustment-aside/inventory-adjustment-aside.component';
import { InventoryAdjustmentBulkEntryComponent } from './component/inventory-adjust-bulk-entry/inventory-adjust-bulk-entry.component';
import { CreateNewInventoryComponent } from './component/create-new-inventory-component/create-new-inventory.component';
import { NewInventoryAdavanceSearch } from './component/new-inventory-advance-search/new-inventory-advance-search.component';
import { InventorySidebarComponent } from './component/inventory-sidebar/inventory-sidebar.component';
@NgModule({
    declarations: [
        NewInventoryComponent,
        NewInventoryGroupComponent,
        CreateNewInventoryAsideComponent,
        InventoryCreateGroupComponent,
        CreateNewGroupComponent,
        CreateNewItemComponent,
        CreateNewUnitComponent,
        AboutGroupDetailComponent,
        InventoryGroupListSidebar,
        StockGroupListComponent,
        ProductServiceListComponent,
        AboutProductServiceDetailComponent,
        InventoryComboListComponent,
        AboutComboDetailComponent,
        CreateComboComponent,
        InventoryTransactionListComponent,
        InventoryCustomFieldComponent,
        CreateCustomFieldComponent,
        AdjustInventoryComponent,
        AsideAdjustInventoryComponent,
        AdjustGroupComponent,
        AdjustProductServiceComponent,
        InventoryAdjustmentReasonAside,
        InventoryAdjustmentBulkEntryComponent,
        CreateNewInventoryComponent,
        NewInventoryAdavanceSearch,
        InventorySidebarComponent
    ],
    imports: [
        NewInventoryRoutingModule,
        SharedModule,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        ModalModule
    ],
    exports: [
        NewInventoryComponent,
        NewInventoryGroupComponent,
        CreateNewInventoryAsideComponent,
        InventoryCreateGroupComponent,
        CreateNewGroupComponent,
        CreateNewItemComponent,
        CreateNewUnitComponent,
        AboutGroupDetailComponent,
        InventoryGroupListSidebar,
        StockGroupListComponent,
        ProductServiceListComponent,
        AboutProductServiceDetailComponent,
        InventoryComboListComponent,
        AboutComboDetailComponent,
        CreateComboComponent,
        InventoryTransactionListComponent,
        InventoryCustomFieldComponent,
        CreateCustomFieldComponent,
        AdjustInventoryComponent,
        AsideAdjustInventoryComponent,
        AdjustGroupComponent,
        AdjustProductServiceComponent,
        InventoryAdjustmentReasonAside,
        InventoryAdjustmentBulkEntryComponent,
        CreateNewInventoryComponent,
        NewInventoryAdavanceSearch,
        InventorySidebarComponent
    ]
})
export class NewInventoryModule { }
