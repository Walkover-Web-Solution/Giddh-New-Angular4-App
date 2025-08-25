import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PurchaseSettingComponent } from './purchase-setting.component';
import { CommonModule } from '@angular/common';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { FormsModule } from '@angular/forms';
import { GiddhDatepickerModule } from '../../theme/giddh-datepicker/giddh-datepicker.module';

@NgModule({
    declarations: [
        PurchaseSettingComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatTabsModule,
        TranslateDirectiveModule,
        MatSlideToggleModule,
        GiddhDatepickerModule
    ],
    exports: [
        PurchaseSettingComponent
    ]
})
export class PurchaseSettingModule { }
