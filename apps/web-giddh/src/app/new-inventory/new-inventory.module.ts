import { NgModule } from "@angular/core";
import { NewInventoryComponent } from "./new-inventory.component";
import { NewInventoryRoutingModule } from "./new-inventory.routing.module";
import { SharedModule } from "../shared/shared.module";
import { MatTabsModule } from "@angular/material/tabs";
import { CreateNewUnitComponent } from "./component/create-unit/create-unit.component";
import { StockGroupListComponent } from "./component/stock-group-list/stock-group-list.component";
import { ProductServiceListComponent } from "./component/inventory-product-service-list/inventory-product-service-list.component";
import { InventoryTransactionListComponent } from "./component/inventory-transaction-list/inventory-transaction-list.component";
import { NewInventoryAdvanceSearch } from "./component/new-inventory-advance-search/new-inventory-advance-search.component";
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { CommonModule } from "@angular/common";
import { DecimalDigitsModule } from "../shared/helpers/directives/decimalDigits/decimalDigits.module";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatRadioModule } from "@angular/material/radio";
import { MatChipsModule } from "@angular/material/chips";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { StockCreateEditModule } from "./component/stock-create-edit/stock-create-edit.module";
import { InventorySidebarModule } from "./component/inventory-sidebar/inventory-sidebar.module";
import { StockBalanceComponent } from "./component/stock-balance/stock-balance.component";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ReportFiltersComponent } from "./component/report-filters/report-filters.component";
import { ReportsComponent } from "./component/reports/reports.component";
import { GroupCreateEditModule } from "./component/create-update-group/create-update-group.module";
import { CustomUnitsComponent } from "./component/custom-units/custom-units.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatListModule } from "@angular/material/list";
import { MatDivider } from "@angular/material/divider";
import { AsideCreateNewUnitComponent } from "./component/aside-create-unit/aside-create-unit.component";
import { CreateUnitGroupComponent } from "./component/create-unit-group/create-unit-group.component";
import { AsideCreateUnitGroupComponent } from "./component/aside-create-unit-group/aside-create-unit-group.component";
import { RecipeModule } from "./component/recipe/recipe.module";
import { ManufacturingModule } from "../manufacturing/manufacturing.module";
import { InventoryMasterComponent } from "./component/inventory-master/inventory-master.component";
import { SelectTableColumnModule } from "../shared/select-table-column/select-table-column.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GiddhDatePipe } from '../shared/pipes/giddh-date.pipe';
import { NoDataModule } from "../shared/no-data/no-data.module";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CdkScrollModule } from "../theme/form-fields/cdk-scroll/cdk-scroll.module";
import { CustomPriceModule } from "./component/custom-price/custom-price.module";
import { BulkStockEditComponent } from "./component/bulk-stock-edit/bulk-stock-edit.component";
import { BulkStockAdvanceFilterComponent } from "./component/bulk-stock-advance-filter/bulk-stock-advance-filter.component";
import { WatchVideoModule } from "../theme/watch-video/watch-video.module";
import { ExportInventoryMasterComponent } from "./component/export-inventory-master/export-inventory-master.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { AdjustInventoryComponent } from "./component/adjust-inventory/adjust-inventory.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { AdjustInventoryListComponent } from "./component/adjust-inventory-list/adjust-inventory-list.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { AsideCreateNewReasonComponent } from "./component/aside-create-reason/aside-create-reason.component";
import { PreviewVariantImageComponent } from "./component/preview-variant-image/preview-variant-image.component";
import { AmountFieldComponentModule } from "../shared/amount-field/amount-field.module";
import { GoToBranchComponent } from '../shared/go-to-branch/go-to-branch.component';

@NgModule({
    declarations: [
        NewInventoryComponent,
        CreateNewUnitComponent,
        StockGroupListComponent,
        ProductServiceListComponent,
        InventoryTransactionListComponent,
        AdjustInventoryComponent,
        AdjustInventoryListComponent,
        NewInventoryAdvanceSearch,
        StockBalanceComponent,
        ReportFiltersComponent,
        ReportsComponent,
        AsideCreateNewUnitComponent,
        CreateUnitGroupComponent,
        AsideCreateUnitGroupComponent,
        CustomUnitsComponent,
        InventoryMasterComponent,
        BulkStockEditComponent,
        BulkStockAdvanceFilterComponent,
        ExportInventoryMasterComponent,
        AdjustInventoryComponent,
        AsideCreateNewReasonComponent,
        PreviewVariantImageComponent
    ],
    imports: [
        NewInventoryRoutingModule,
        SharedModule,
        CommonModule,
        FormFieldsModule,
        TranslateDirectiveModule,
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
        MatDialogModule,
        MatAutocompleteModule,
        MatTooltipModule,
        SelectTableColumnModule,
        MatGridListModule,
        MatListModule,
        RecipeModule,
        ManufacturingModule,
        CdkScrollModule,
        FormsModule,
        NoDataModule,
        DragDropModule,
        CustomPriceModule,
        WatchVideoModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        AmountFieldComponentModule,
        GiddhDatePipe,
        GoToBranchComponent
    ],
    exports: [
        NewInventoryComponent,
        CreateNewUnitComponent,
        StockGroupListComponent,
        ProductServiceListComponent,
        InventoryTransactionListComponent,
        AdjustInventoryComponent,
        AdjustInventoryListComponent,
        NewInventoryAdvanceSearch,
        ReportFiltersComponent,
        MatDivider,
        BulkStockAdvanceFilterComponent,
        AdjustInventoryComponent,
        PreviewVariantImageComponent
    ]
})
export class NewInventoryModule { }
