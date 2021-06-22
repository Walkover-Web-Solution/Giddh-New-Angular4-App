import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { SelectModule } from '../../theme/ng-select/ng-select';
import { NgxMaskModule } from '../helpers/directives/ngx-mask';
import { CurrencyModule } from '../helpers/pipes/currencyPipe/currencyType.module';
import { SharedModule } from '../shared.module';
import { AdvanceReceiptAdjustmentComponent } from './advance-receipt-adjustment.component';

@NgModule({
    declarations: [AdvanceReceiptAdjustmentComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        LaddaModule,
        SelectModule,
        SharedModule,
        NgxMaskModule.forRoot(),
        CurrencyModule
    ],
    exports: [AdvanceReceiptAdjustmentComponent]
})
export class AdvanceReceiptAdjustmentModule {

}
