import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { SelectModule } from 'apps/web-giddh/src/app/theme/ng-select/ng-select';
import { ShSelectModule } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.module';
import { TranslateDirectiveModule } from 'apps/web-giddh/src/app/theme/translate/translate.directive.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccountAddNewDetailsComponent } from './account-add-new-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BulkAddDialogComponent } from '../bulk-add-dialog/bulk-add-dialog.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { FormFieldsModule } from 'apps/web-giddh/src/app/theme/form-fields/form-fields.module';

@NgModule({
    declarations: [AccountAddNewDetailsComponent, BulkAddDialogComponent],
    exports: [AccountAddNewDetailsComponent],
    imports: [
        CommonModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ReactiveFormsModule,
        TabsModule.forRoot(),
        TranslateDirectiveModule,
        MatSlideToggleModule,
        RouterModule,
        MatDialogModule,
        MatButtonModule,
        FormsModule,
        MatRadioModule,
        MatTabsModule,
        TooltipModule.forRoot(),
        FormFieldsModule
    ]
})
export class AccountAddNewDetailsModule { }
