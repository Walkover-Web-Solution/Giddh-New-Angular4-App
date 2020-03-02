import { AdvanceReceiptAdjustmentComponent } from './advance-receipt-adjustment.component';
import { SharedModule } from '../shared.module';
import { SelectModule } from '../../theme/ng-select/ng-select';
import { LaddaModule } from 'angular2-ladda';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [AdvanceReceiptAdjustmentComponent],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        CommonModule,
        LaddaModule,
        SelectModule,
        SharedModule
    ],
    exports: [AdvanceReceiptAdjustmentComponent]
})
export class AdvanceReceiptAdjustmentModule{

}
