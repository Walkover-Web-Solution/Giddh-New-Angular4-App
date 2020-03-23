import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { CreateAdvanceReceiptComponent } from './create-advance-receipt.component';
import { CreateAdvanceReceiptRoutingModule } from './create-advance-receipt.routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        CreateAdvanceReceiptComponent
    ],
    exports: [
        CreateAdvanceReceiptComponent
    ],
    providers: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DatepickerModule,
        BsDatepickerModule,
        ShSelectModule,
        CreateAdvanceReceiptRoutingModule,
        SharedModule
    ],
})
export class CreateAdvanceReceiptModule {
}
