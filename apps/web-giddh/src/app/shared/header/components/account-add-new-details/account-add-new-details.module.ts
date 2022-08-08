import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { SelectModule } from 'apps/web-giddh/src/app/theme/ng-select/ng-select';
import { ShSelectModule } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.module';
import { TranslateDirectiveModule } from 'apps/web-giddh/src/app/theme/translate/translate.directive.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccountAddNewDetailsComponent } from './account-add-new-details.component';
import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
    declarations: [AccountAddNewDetailsComponent],
    exports: [AccountAddNewDetailsComponent],
    imports: [
        CommonModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ReactiveFormsModule,
        SelectModule,
        ShSelectModule,
        TabsModule.forRoot(),
        TranslateDirectiveModule,
        NgxIntlTelInputModule,
        NgxBootstrapSwitchModule.forRoot(),
        RouterModule
    ]
})
export class AccountAddNewDetailsModule { }
