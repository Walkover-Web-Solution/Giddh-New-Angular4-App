import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import {
    AccountingSidebarComponent,
} from 'apps/web-giddh/src/app/accounting/accouting-sidebar/accounting-sidebar.component';
import { KeyboardService } from 'apps/web-giddh/src/app/accounting/keyboard.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
// import { InventoryModule } from './../inventory/inventory.module';
import { SharedModule } from './../shared/shared.module';
import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingComponent } from './accounting.component';
import { JournalVoucherComponent } from './journal-voucher/journal-voucher.component';
import { AccountAsVoucherComponent } from './journal-voucher/voucher/voucher.component';
import { OnReturnDirective } from './keyboard.directive';
import { TallyModuleService } from './tally-service';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { A11yModule } from '@angular/cdk/a11y';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';

@NgModule({
    declarations: [
        JournalVoucherComponent,
        AccountingSidebarComponent,
        AccountAsVoucherComponent,
        OnReturnDirective,
        AccountingComponent,
    ],
    exports: [RouterModule, AccountingSidebarComponent],
    providers: [KeyboardService, TallyModuleService],
    imports: [
        AccountingRoutingModule,
        RouterModule,
        CommonModule,
        GiddhNumberFormatModule,
        FormsModule,
        ReactiveFormsModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        DecimalDigitsModule,
        SharedModule,
        ClickOutsideModule,
        ElementViewChildModule,
        // InventoryModule,
        NgxMaskModule.forRoot(),
        FormsModule,
        FormFieldsModule,
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        A11yModule,
        GiddhDatepickerModule,
        KeyboardShortutModule,
        ScrollingModule,
        MatTooltipModule,
        MatInputModule,
        HamburgerMenuModule
    ],
})
export class AccountingModule {
}
