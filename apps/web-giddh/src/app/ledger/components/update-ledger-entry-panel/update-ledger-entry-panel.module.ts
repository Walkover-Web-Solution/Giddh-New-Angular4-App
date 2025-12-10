import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { AdvanceReceiptAdjustmentModule } from '../../../shared/advance-receipt-adjustment/advance-receipt-adjustment.module';
import { AmountFieldComponentModule } from '../../../shared/amount-field/amount-field.module';
import { DecimalDigitsModule } from '../../../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { NgxMaskModule } from '../../../shared/helpers/directives/ngx-mask';
import { NumberToWordsModule } from '../../../shared/helpers/pipes/numberToWords/numberToWords.module';
import { ReplacePipeModule } from '../../../shared/helpers/pipes/replace/replace.module';
import { ConfirmModalModule } from '../../../theme/confirm-modal/confirm-modal.module';
import { TranslateDirectiveModule } from '../../../theme/translate/translate.directive.module';
import { UpdateLedgerTaxControlComponent } from '../update-ledger-tax-control/update-ledger-tax-control.component';
import { UpdateLedgerDiscountComponent } from '../update-ledger-discount/update-ledger-discount.component';
import { UpdateLedgerEntryPanelComponent } from './update-ledger-entry-panel.component';
import { AsideMenuSalesOtherTaxesModule } from '../../../sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.module';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GiddhDatepickerModule } from '../../../theme/giddh-datepicker/giddh-datepicker.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { AttachmentsModule } from '../../../theme/attachments/attachments.module';
import { LaddaModule } from 'angular2-ladda';
// import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { AsideMenuCreateTaxModule } from '../../../shared/aside-menu-create-tax/aside-menu-create-tax.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";

@NgModule({
    declarations: [
        UpdateLedgerEntryPanelComponent,
        UpdateLedgerTaxControlComponent,
        UpdateLedgerDiscountComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        ConfirmModalModule,
        CommonModule,
        FormsModule,
        TranslateDirectiveModule,
        NgxMaskModule,
        ClickOutsideModule,
        ReplacePipeModule,
        AsideMenuSalesOtherTaxesModule,
        MatInputModule,
        MatCheckboxModule,
        GiddhDatepickerModule,
        MatTooltipModule,
        MatButtonModule,
        MatDialogModule,
        MatSelectModule,
        MatExpansionModule,
        ReactiveFormsModule,
        AttachmentsModule,
        MatTabsModule,
        spinnerSize: 30
    
    ]
        }),
        OverlayModule
    ],
    exports: [
        UpdateLedgerEntryPanelComponent,
        UpdateLedgerTaxControlComponent,
        UpdateLedgerDiscountComponent
    ]
})
export class UpdateLedgerEntryPanelModule {}
