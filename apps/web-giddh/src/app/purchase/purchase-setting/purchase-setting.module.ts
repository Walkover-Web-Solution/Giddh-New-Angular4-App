import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
        MatTabsModule,
        TranslateDirectiveModule,
        BsDatepickerModule.forRoot(),
        MatSlideToggleModule
    ],
    exports: [
        PurchaseSettingComponent
    ]
})
export class PurchaseSettingModule { }
