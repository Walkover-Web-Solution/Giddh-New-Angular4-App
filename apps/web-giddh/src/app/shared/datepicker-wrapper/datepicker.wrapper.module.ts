import { NgModule } from '@angular/core';
import { NgxDaterangepickerMd } from '../../theme/ngx-date-range-picker';
import { DatepickerWrapperComponent } from './datepicker.wrapper.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [DatepickerWrapperComponent],
    imports: [NgxDaterangepickerMd.forRoot()],
    exports: [DatepickerWrapperComponent]
})
/**
 * DatepickerWrapperModule module
 * Implements DatepickerWrapperModule functionality
 */
export class DatepickerWrapperModule { }
