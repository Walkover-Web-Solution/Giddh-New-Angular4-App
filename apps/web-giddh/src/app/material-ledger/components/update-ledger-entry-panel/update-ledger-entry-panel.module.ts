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
import { ReplacePipeModule } from '../../../shared/helpers/pipes/replace/replace.module';
import { ConfirmModalModule } from '../../../theme/confirm-modal/confirm-modal.module';
import { ShSelectModule } from '../../../theme/ng-virtual-select/sh-select.module';
import { TranslateDirectiveModule } from '../../../theme/translate/translate.directive.module';
import { UpdateLedgerTaxControlComponent } from '../update-ledger-tax-control/update-ledger-tax-control.component';
import { UpdateLedgerDiscountComponent } from '../update-ledger-discount/update-ledger-discount.component';
import { UpdateLedgerEntryPanelComponent } from './update-ledger-entry-panel.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { AsideMenuSalesOtherTaxesModule } from '../../../sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.module';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GiddhDatepickerModule } from '../../../theme/giddh-datepicker/giddh-datepicker.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { DeleteTemplateConfirmationModalModule } from '../../../invoice/templates/edit-template/modals/confirmation-modal/confirmation.modal.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { AttachmentsModule } from '../../../theme/attachments/attachments.module';

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
        ClickOutsideModule,
        ReplacePipeModule,
        NgxUploaderModule,
        AsideMenuSalesOtherTaxesModule,
        MatInputModule,
        MatCheckboxModule,
        GiddhDatepickerModule,
        MatTooltipModule,
        MatButtonModule,
        MatDialogModule,
        MatSelectModule,
        DeleteTemplateConfirmationModalModule,
        MatExpansionModule,
        AttachmentsModule
    ],
    exports: [UpdateLedgerEntryPanelComponent, UpdateLedgerTaxControlComponent, UpdateLedgerDiscountComponent]
})
export class UpdateLedgerEntryPanelModule {}
