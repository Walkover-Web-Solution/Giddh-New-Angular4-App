import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { InvoiceSettingComponent } from './invoice.settings.component';

import { GiddhDatepickerModule } from '../../theme/giddh-datepicker/giddh-datepicker.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ValidateSectionPermissionDirectiveModule } from '../../shared/validate-section-permission/validate-section-permission.module';

@NgModule({
    declarations: [
        InvoiceSettingComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        TabsModule.forRoot(),
        TranslateDirectiveModule,
        TooltipModule.forRoot(),
        BsDatepickerModule.forRoot(),
        MatSlideToggleModule,
        ValidateSectionPermissionDirectiveModule,
        GiddhDatepickerModule
    ],
    exports: [
        InvoiceSettingComponent
    ]
})
export class InvoiceSettingModule { }
