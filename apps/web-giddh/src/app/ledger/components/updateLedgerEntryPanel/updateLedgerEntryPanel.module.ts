import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { ConfirmationModalModule } from '../../../common/confirmation-modal/confirmation-modal.module';
import { AdvanceReceiptAdjustmentModule } from '../../../shared/advance-receipt-adjustment/advance-receipt-adjustment.module';
import { AmountFieldComponentModule } from '../../../shared/amount-field/amount-field.module';
import { DecimalDigitsModule } from '../../../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { NgxMaskModule } from '../../../shared/helpers/directives/ngx-mask';
import { NumberToWordsModule } from '../../../shared/helpers/pipes/numberToWords/numberToWords.module';
import { ConfirmModalModule } from '../../../theme/confirm-modal/confirm-modal.module';
import { ShSelectModule } from '../../../theme/ng-virtual-select/sh-select.module';
import { TranslateDirectiveModule } from '../../../theme/translate/translate.directive.module';
import { UpdateLedgerTaxControlComponent } from '../updateLedger-tax-control/updateLedger-tax-control.component';
import { UpdateLedgerDiscountComponent } from '../updateLedgerDiscount/updateLedgerDiscount.component';
import { UpdateLedgerEntryPanelComponent } from './updateLedgerEntryPanel.component';

@NgModule({
    declarations: [
        UpdateLedgerEntryPanelComponent,
        UpdateLedgerTaxControlComponent,
        UpdateLedgerDiscountComponent
    ],
    imports: [
        ModalModule.forChild(),
        ConfirmModalModule,
        ShSelectModule,
        CommonModule,
        FormsModule,
        TranslateDirectiveModule,
        AmountFieldComponentModule,
        ConfirmationModalModule,
        NumberToWordsModule,
        NgxMaskModule,
        PopoverModule,
        BsDatepickerModule,
        AdvanceReceiptAdjustmentModule,
        DecimalDigitsModule,
        ClickOutsideModule
    ],
    exports: [UpdateLedgerEntryPanelComponent]
})
export class UpdateLedgerEntryPanelModule {}
