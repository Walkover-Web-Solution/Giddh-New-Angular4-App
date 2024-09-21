import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { InvoiceModule } from '../../invoice/invoice.module';
import { PurchaseSettingComponent } from './purchase-setting.component';
import { CommonModule } from '@angular/common';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    declarations: [
        PurchaseSettingComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        InvoiceModule,
        TabsModule.forRoot(),
        TranslateDirectiveModule,
        TooltipModule.forRoot(),
        BsDatepickerModule.forRoot(),
        MatSlideToggleModule
    ],
    exports: [
        PurchaseSettingComponent
    ]
})
export class PurchaseSettingModule { }
