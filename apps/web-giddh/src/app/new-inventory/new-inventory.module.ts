import { NgModule } from "@angular/core";
import { ModalModule } from "ngx-bootstrap/modal";
import { NewInventoryComponent } from "./new-inventory.component";
import { NewInventoryRoutingModule } from "./new-inventory.routing.module";
import { SharedModule } from "../shared/shared.module";
import { TabsModule } from "ngx-bootstrap/tabs";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { CreateNewGroupComponent } from "./component/create-new-group/create-new-group.component";
import { CreateNewItemComponent } from "./component/create-new-item/create-new-item.component";
import { CreateNewUnitComponent } from "./component/create-unit/create-unit.component";
import { CreateComboComponent } from "./component/create-combo/create-combo.component";
import { AboutGroupDetailComponent } from "./component/about-group-detail/about-group-detail.component";
import { InventoryGroupListSidebar } from "./component/inventory-group-list-sidebar/inventory-group-list-sidebar.component";
import { StockGroupListComponent } from "./component/stock-group-list/stock-group-list.component";
import { ProductServiceListComponent } from "./component/inventory-product-service-list/inventory-product-service-list.component";
import { AboutProductServiceDetailComponent } from "./component/about-product-service-detail/about-product-service-detail.component";
import { InventoryComboListComponent } from "./component/combo-list/inventory-combo-list.component";
import { AboutComboDetailComponent } from "./component/about-combo-detail/about-combo-detail.component";
import { InventoryTransactionListComponent } from "./component/inventory-transaction-list/inventory-transaction-list.component";
import { CreateCustomFieldComponent } from "./component/create-custom-field/create-custom-field.component";
import { AdjustInventoryComponent } from "./component/adjust-inventory-list/adjust-inventory-list.component";
import { AsideAdjustInventoryComponent } from "./component/adjust-inventory-aside/adjust-inventory-aside.component";
import { AdjustGroupComponent } from "./component/adjust-group/adjust-group.component";
import { AdjustProductServiceComponent } from "./component/adjust-product-service/adjust-product-service.component";
import { InventoryAdjustmentReasonAside } from "./component/inventory-adjustment-aside/inventory-adjustment-aside.component";
import { InventoryAdjustmentBulkEntryComponent } from "./component/inventory-adjust-bulk-entry/inventory-adjust-bulk-entry.component";
import { CreateNewInventoryComponent } from "./component/create-new-inventory-component/create-new-inventory.component";
import { NewInventoryAdvanceSearch } from "./component/new-inventory-advance-search/new-inventory-advance-search.component";
import { InventoryDashboardComponent } from "./component/inventory-dashboard/inventory-dashboard.component";
import { InventoryActivityComponent } from "./component/inventory-dashboard/inventory-activity/inventory-activity.component";
import { DashboardItemProductDetail } from "./component/inventory-dashboard/dashboard-item-product-detail/dashboard-item-product-detail.component";
import { DashboardSellingProduct } from "./component/inventory-dashboard/dashboard-selling-product/dashboard-selling-product.component";
import { DashboardProfitStockList } from "./component/inventory-dashboard/dashboard-profit-stocklist/dashboard-profit-stocklist.component";
import { DashboardPurchaseReport } from "./component/inventory-dashboard/dashboard-purchase-report/dashboard-purchase-report.component";
import { DashboardSalesReport } from "./component/inventory-dashboard/dashboard-sales-report/dashboard-sales-report.component";
import { DashboardSellingReport } from "./component/inventory-dashboard/dashboard-selling-report/dashboard-selling-report.component";
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { CommonModule } from "@angular/common";
import { NgxUploaderModule } from "ngx-uploader";
import { DecimalDigitsModule } from "../shared/helpers/directives/decimalDigits/decimalDigits.module";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { ListGroupComponent } from "./component/stock-group/list-group/list-group.component";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { MatChipsModule } from "@angular/material/chips";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { StockCreateEditModule } from "./component/stock-create-edit/stock-create-edit.module";
import { InventorySidebarModule } from "./component/inventory-sidebar/inventory-sidebar.module";
import { StockBalanceComponent } from "./component/stock-balance/stock-balance.component";
import { GroupwiseComponent } from "./component/stock-group/group-wise/group-wise.component";
import { ItemWiseComponent } from "./component/stock-group/item-wise/item-wise.component";
import { VariantWiseComponent } from "./component/variant-wise/variant-wise.component";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ReportFiltersComponent } from "./component/report-filters/report-filters.component";
import { ReportsComponent } from "./component/reports/reports.component";
import { GroupCreateEditModule } from "./component/create-update-group/create-update-group.module";
import { InventoryCreateUpdateGroupComponent } from "./component/stock-group/create-update-group/create-update-group.component";
import { CustomUnitsComponent } from "./component/custom-units/custom-units.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatListModule } from "@angular/material/list";
import { MatDivider } from "@angular/material/divider";
import { AsideCreateNewUnitComponent } from "./component/aside-create-unit/aside-create-unit.component";
import { CreateGroupComponent } from "./component/create-group/create-group.component";
import { AsideCreatGroupComponent } from "./component/aside-create-group/aside-create-group.component";
import { RecipeModule } from "./component/recipe/recipe.module";
import { InventoryMasterComponent } from "./component/inventory-master/inventory-master.component";

@NgModule({
    declarations: [
        NewInventoryComponent,
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
        CreateCustomFieldComponent,
        AdjustInventoryComponent,
        AsideAdjustInventoryComponent,
        AdjustGroupComponent,
        AdjustProductServiceComponent,
        InventoryAdjustmentReasonAside,
        InventoryAdjustmentBulkEntryComponent,
        InventoryCreateUpdateGroupComponent,
        CreateNewInventoryComponent,
        NewInventoryAdvanceSearch,
        InventoryDashboardComponent,
        InventoryActivityComponent,
        DashboardItemProductDetail,
        DashboardSellingProduct,
        DashboardProfitStockList,
        DashboardPurchaseReport,
        DashboardSalesReport,
        DashboardSellingReport,
        ListGroupComponent,
        StockBalanceComponent,
        GroupwiseComponent,
        ItemWiseComponent,
        VariantWiseComponent,
        ReportFiltersComponent,
        ReportsComponent,
        AsideCreateNewUnitComponent,
        CreateGroupComponent,
        AsideCreatGroupComponent,
        CustomUnitsComponent,
        InventoryMasterComponent
    ],
    imports: [
        NewInventoryRoutingModule,
        SharedModule,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        CommonModule,
        ModalModule,
        FormFieldsModule,
        TranslateDirectiveModule,
        NgxUploaderModule,
        DecimalDigitsModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTableModule,
        MatSortModule,
        MatRadioModule,
        MatTabsModule,
        MatChipsModule,
        MatInputModule,
        MatSelectModule,
        InventorySidebarModule,
        GroupCreateEditModule,
        StockCreateEditModule,
        NgxMatSelectSearchModule,
        GiddhPageLoaderModule,
        PaginationModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatTooltipModule,
        MatGridListModule,
        MatListModule,
        RecipeModule
    ],
    exports: [
        NewInventoryComponent,
        ListGroupComponent,
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
        CreateCustomFieldComponent,
        AdjustInventoryComponent,
        AsideAdjustInventoryComponent,
        AdjustGroupComponent,
        AdjustProductServiceComponent,
        InventoryAdjustmentReasonAside,
        InventoryAdjustmentBulkEntryComponent,
        CreateNewInventoryComponent,
        NewInventoryAdvanceSearch,
        InventoryDashboardComponent,
        InventoryActivityComponent,
        DashboardItemProductDetail,
        DashboardSellingProduct,
        DashboardProfitStockList,
        DashboardPurchaseReport,
        DashboardSalesReport,
        DashboardSellingReport,
        ReportFiltersComponent,
        MatDivider
    ]
})
export class NewInventoryModule { }
