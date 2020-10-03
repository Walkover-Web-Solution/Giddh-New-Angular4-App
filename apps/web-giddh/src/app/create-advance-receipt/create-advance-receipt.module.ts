import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';

import { SharedModule } from '../shared/shared.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { CreateAdvanceReceiptComponent } from './create-advance-receipt.component';
import { CreateAdvanceReceiptRoutingModule } from './create-advance-receipt.routing.module';

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
        ShSelectModule,
        CreateAdvanceReceiptRoutingModule,
        SharedModule
    ],
})
export class CreateAdvanceReceiptModule {
}
