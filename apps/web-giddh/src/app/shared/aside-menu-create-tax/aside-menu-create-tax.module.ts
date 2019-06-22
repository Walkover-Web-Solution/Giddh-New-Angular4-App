import { NgModule } from '@angular/core';
import { AsideMenuCreateTaxComponent } from './aside-menu-create-tax.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShSelectModule } from '../../theme/ng-virtual-select/sh-select.module';
import { LaddaModule } from 'angular2-ladda';
import { DecimalDigitsModule } from '../helpers/directives/decimalDigits/decimalDigits.module';


@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, ShSelectModule, LaddaModule, DecimalDigitsModule
  ],
  exports: [AsideMenuCreateTaxComponent],
  declarations: [AsideMenuCreateTaxComponent],
  providers: [],
})
export class AsideMenuCreateTaxModule {
}
