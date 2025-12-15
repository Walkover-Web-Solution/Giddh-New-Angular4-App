import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerWrapperComponent } from './datepicker.wrapper.component';

@NgModule({
    declarations: [DatepickerWrapperComponent],
    imports: [CommonModule],
    exports: [DatepickerWrapperComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DatepickerWrapperModule { }
