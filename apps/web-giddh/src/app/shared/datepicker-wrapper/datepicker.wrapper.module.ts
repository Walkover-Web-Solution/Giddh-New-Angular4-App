import { NgModule } from '@angular/core';

import { NgxDaterangepickerMd } from '../../theme/ngx-date-range-picker';
import { DatepickerWrapperComponent } from './datepicker.wrapper.component';

@NgModule({
    declarations: [DatepickerWrapperComponent],
    imports: [NgxDaterangepickerMd],
    exports: [DatepickerWrapperComponent]
})
export class DatepickerWrapperModule { }
