import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
// import { SharedModule } from '../shared/shared.module';
import { NewVsOldInvoicesComponent } from './new-vs-old-Invoices.component';
import { NewVsOldInvoicesRoutingModule } from './new-vs-old-Invoices.routing.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';
import { SalesBifurcationDetailsComponent } from './sales-bifurcation-details/sales-bifurcation-details.component';
// import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
// import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { AttachmentsModule } from '../theme/attachments/attachments.module';
import { ActionMenuComponent } from '../shared/action-menu/action-menu.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FroalaTemplateEditorModule } from '../shared/template-froala/template-froala.module';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";


@NgModule({
    declarations: [
        NewVsOldInvoicesComponent,
        SalesBifurcationDetailsComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ElementViewChildModule,
        NewVsOldInvoicesRoutingModule,
        LaddaModule.forRoot({ style: 'slide-left',
        spinnerSize: 30
    
    ]
        }),
        // SharedModule,
        GiddhNumberFormatModule,
                // FormFieldsModule, // Temporarily disabled for compilation
        MatButtonModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        KeyboardShortutModule,
        TranslateDirectiveModule,
        // GiddhPageLoaderModule,
        MatMenuModule,
        MatSortModule,
        AttachmentsModule,
        ActionMenuComponent,
        FroalaTemplateEditorModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule
    ],
    providers: []
})

export class NewVsOldInvoicesModule {

}
