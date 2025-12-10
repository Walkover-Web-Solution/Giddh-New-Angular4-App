import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { InventorySidebarModule } from '../inventory-sidebar/inventory-sidebar.module';
import { HamburgerMenuModule } from '../../../shared/header/components/hamburger-menu/hamburger-menu.module';
// import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
// Temporarily disabled;
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
// 
import { GiddhPageLoaderModule } from '../../../shared/giddh-page-loader/giddh-page-loader.module';

import { MatSortModule } from '@angular/material/sort';
import { TranslateDirectiveModule } from '../../../theme/translate/translate.directive.module';
import { AsideManageTransportComponent } from './aside-manage-transport/aside-manage-transport.component';
import { AsideMenuProductServiceModule } from '../../../shared/aside-menu-product-service/aside-menu-product-service.module';
import { CreateBranchTransferComponent } from './create-branch-transfer/create-branch-transfer.component';
import { ListBranchTransferComponent } from './list-branch-transfer/list-branch-transfer.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GiddhNumberFormatModule } from '../../../shared/helpers/pipes/number-format/number-format.module';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";
@NgModule({
    imports: [
        CommonModule,
        InventorySidebarModule,
        HamburgerMenuModule,
        BranchTransferRoutingModule,
        MatTooltipModule,
        MatTableModule,
        MatDialogModule,
        MatMenuModule,
        MatRadioModule,
        FormsModule,
        ClickOutsideModule,
        MatFormFieldModule,
        MatInputModule,
        GiddhNumberFormatModule,
        MatSortModule,
        ReactiveFormsModule,
        TranslateDirectiveModule
    
    ],
    exports: [
        AsideManageTransportComponent,
        CreateBranchTransferComponent,
        ListBranchTransferComponent
    
    ],
    declarations: [
        MainComponent,
        AsideManageTransportComponent,
        CreateBranchTransferComponent,
        ListBranchTransferComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ]
})
export class BranchTransferModule { }
