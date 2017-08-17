import { NgModule } from '@angular/core';
import { DatePickerComponent } from './date-picker.component';
import { CommonModule } from '@angular/common';
import { DatepickerModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent],
  imports: [CommonModule, DatepickerModule]

})
export class DatePickerModule {
}
