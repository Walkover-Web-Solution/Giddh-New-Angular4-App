import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { InventorySidebarModule } from '../inventory-sidebar/inventory-sidebar.module';
import { HamburgerMenuModule } from '../../../shared/header/components/hamburger-menu/hamburger-menu.module';
import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { GiddhDatepickerModule } from '../../../theme/giddh-datepicker/giddh-datepicker.module';
import { BranchTransferRoutingModule } from './branch-transfer.routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { DatepickerWrapperModule } from '../../../shared/datepicker-wrapper/datepicker.wrapper.module';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { GiddhPageLoaderModule } from '../../../shared/giddh-page-loader/giddh-page-loader.module';
import { CurrencyModule } from '../../../shared/helpers/pipes/currencyPipe/currencyType.module';
import { MatSortModule } from '@angular/material/sort';
import { TranslateDirectiveModule } from '../../../theme/translate/translate.directive.module';
import { AsideManageTransportComponent } from './aside-manage-transport/aside-manage-transport.component';
import { AsideMenuProductServiceModule } from '../../../shared/aside-menu-product-service/aside-menu-product-service.module';
import { CreateBranchTransfer } from './create-branch-transfer/create-branch-transfer';
import { ListBranchTransfer } from './list-branch-transfer/list-branch-transfer';
@NgModule({
    imports: [
        CommonModule,
        InventorySidebarModule,
        HamburgerMenuModule,
        BranchTransferRoutingModule,
        FormFieldsModule,
        MatButtonModule,
        MatTooltipModule,
        MatTableModule,
        MatDialogModule,
        MatMenuModule,
        DatepickerWrapperModule,
        GiddhDatepickerModule,
        MatRadioModule,
        FormsModule,
        ClickOutsideModule,
        MatFormFieldModule,
        MatInputModule,
        PaginationModule.forRoot(),
        GiddhPageLoaderModule,
        CurrencyModule,
        MatSortModule,
        ReactiveFormsModule,
        TranslateDirectiveModule,
        AsideMenuProductServiceModule
    ],
    exports: [
        AsideManageTransportComponent, ListBranchTransfer, CreateBranchTransfer
    ],
    declarations: [MainComponent, ListBranchTransfer, CreateBranchTransfer, AsideManageTransportComponent]
})
export class BranchTransferModule { }
