import { NgModule } from '@angular/core';
import { DiscountControlComponent } from './discount-control.component';
import { DecimalDigitsModule } from '../../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  imports: [
    DecimalDigitsModule,
    CommonModule,
    FormsModule,
    ClickOutsideModule
  ],
  exports: [
    DiscountControlComponent
  ],
  declarations: [DiscountControlComponent],
  providers: [],
})
export class DiscountControlModule {
}
