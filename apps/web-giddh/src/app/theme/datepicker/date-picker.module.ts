import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerComponent } from './date-picker.component';
import { CommonModule } from '@angular/common';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    declarations: [DatePickerComponent],
    exports: [DatePickerComponent],
    imports: [CommonModule, FormsModule, DatepickerModule]

})
export class DatePickerCustomModule {
    public static forRoot(): ModuleWithProviders<unknown> {
        return {
            ngModule: DatePickerCustomModule,
            providers: []
        };
    }
}
