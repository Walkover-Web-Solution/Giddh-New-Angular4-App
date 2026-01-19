import { NgModule } from '@angular/core';
import { DaterangePickerComponent } from './daterangepicker.component';
import { DaterangepickerConfig } from './config.service';

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [DaterangePickerComponent],
    providers: [DaterangepickerConfig],
    exports: [DaterangePickerComponent]
})

/**
 * Daterangepicker module
 * Implements Daterangepicker functionality
 */
export class Daterangepicker {
}
