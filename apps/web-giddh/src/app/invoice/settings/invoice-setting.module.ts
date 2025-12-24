import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { InvoiceSettingComponent } from './invoice.settings.component';
import { MatButtonModule } from '@angular/material/button';
import { GiddhDatepickerModule } from '../../theme/giddh-datepicker/giddh-datepicker.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ValidateSectionPermissionDirectiveModule } from '../../shared/validate-section-permission/validate-section-permission.module';
import { SubscriptionUpgradeButtonModule } from '../../shared/subscription-upgrade-button/subscription-upgrade-button.module';

@NgModule({
    declarations: [
        InvoiceSettingComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatTabsModule,
        TranslateDirectiveModule,
        MatSlideToggleModule,
        ValidateSectionPermissionDirectiveModule,
        GiddhDatepickerModule,
        MatButtonModule,
        SubscriptionUpgradeButtonModule
    ],
    exports: [
        InvoiceSettingComponent
    ]
})
export class InvoiceSettingModule { }
