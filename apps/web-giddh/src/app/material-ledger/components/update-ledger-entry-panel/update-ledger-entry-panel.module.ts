import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { AttachmentsModule } from '../../../theme/attachments/attachments.module';
import { LaddaModule } from 'angular2-ladda';

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
        NumberToWordsModule,
        NgxMaskModule,
        PopoverModule.forRoot(),
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
        MatExpansionModule,
        AttachmentsModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        })
    ],
    exports: [UpdateLedgerEntryPanelComponent, UpdateLedgerTaxControlComponent, UpdateLedgerDiscountComponent]
})
export class UpdateLedgerEntryPanelModule {}
