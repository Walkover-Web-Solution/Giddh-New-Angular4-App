import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { InventorySidebarModule } from '../inventory-sidebar/inventory-sidebar.module';
import { HamburgerMenuModule } from '../../../shared/header/components/hamburger-menu/hamburger-menu.module';
// import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { MatButtonModule } from '@angular/material/button';
import { CreateManufacturingComponent } from './create-manufacturing/create-manufacturing.component';
import { ManufacturingRoutingModule } from './manufacturing.routing.module';
import { ListManufacturingComponent } from './list-manufacturing/list-manufacturing.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { DatepickerWrapperModule } from '../../../shared/datepicker-wrapper/datepicker.wrapper.module';

import { GiddhDatepickerModule } from '../../../theme/giddh-datepicker/giddh-datepicker.module';
import { FormsModule } from '@angular/forms';
import { TranslateDirectiveModule } from '../../../theme/translate/translate.directive.module';
import { NoDataModule } from '../../../shared/no-data/no-data.module';
// import { GiddhPageLoaderModule } from '../../../shared/giddh-page-loader/giddh-page-loader.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { WatchVideoModule } from '../../../theme/watch-video/watch-video.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    imports: [
        CommonModule,
        InventorySidebarModule,
        HamburgerMenuModule,
        ManufacturingRoutingModule,
        MatTableModule,
        MatDialogModule,
        MatTooltipModule,
        MatMenuModule,
        FormsModule,
        TranslateDirectiveModule,
        NoDataModule,
        MatExpansionModule,
        MatSlideToggleModule,
        WatchVideoModule,
        MatPaginatorModule
    
    ],
    exports: [
        CreateManufacturingComponent,
        ListManufacturingComponent
    
    ],
    declarations: [
        MainComponent,
        CreateManufacturingComponent,
        ListManufacturingComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ]
})
export class ManufacturingModule { }
