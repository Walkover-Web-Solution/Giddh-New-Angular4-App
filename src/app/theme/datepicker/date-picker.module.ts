import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from './date-picker.component';
import { CommonModule } from '@angular/common';
import { DatepickerModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent],
  imports: [CommonModule, FormsModule, DatepickerModule]

})
export class DatePickeCustomrModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: DatePickeCustomrModule,
      providers: []
    };
  }
}
