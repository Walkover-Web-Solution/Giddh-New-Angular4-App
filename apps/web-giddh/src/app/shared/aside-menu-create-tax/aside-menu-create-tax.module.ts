import { NgModule } from '@angular/core';
import { AsideMenuCreateTaxComponent } from './aside-menu-create-tax.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShSelectModule } from '../../theme/ng-virtual-select/sh-select.module';
import { LaddaModule } from 'angular2-ladda';
import { DecimalDigitsModule } from '../helpers/directives/decimalDigits/decimalDigits.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { KeyboardShortutModule } from '../helpers/directives/keyboardShortcut/keyboardShortut.module';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { GiddhPageLoaderModule } from '../giddh-page-loader/giddh-page-loader.module';


@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, ShSelectModule, LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }), DecimalDigitsModule, BsDatepickerModule.forRoot(), KeyboardShortutModule, TranslateDirectiveModule, GiddhPageLoaderModule
    ],
    exports: [AsideMenuCreateTaxComponent],
    declarations: [AsideMenuCreateTaxComponent],
    providers: [],
})
export class AsideMenuCreateTaxModule {
}
