import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { SelectModule } from 'apps/web-giddh/src/app/theme/ng-select/ng-select';
import { ShSelectModule } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.module';
import { TranslateDirectiveModule } from 'apps/web-giddh/src/app/theme/translate/translate.directive.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccountAddNewDetailsComponent } from './account-add-new-details.component';
import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';
import { NgxMatIntlTelInputModule } from 'ngx-mat-intl-tel-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [AccountAddNewDetailsComponent],
    exports: [AccountAddNewDetailsComponent],
    imports: [
        CommonModule,
        LaddaModule,
        ReactiveFormsModule,
        SelectModule,
        ShSelectModule,
        TabsModule,
        TranslateDirectiveModule,
        NgxBootstrapSwitchModule.forRoot(),
        NgxMatIntlTelInputModule,
        RouterModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatInputModule,
    ]
})
export class AccountAddNewDetailsModule { }
