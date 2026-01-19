import { LOCALE_ID, NgModule } from "@angular/core";
import { GiddhDaterangepickerComponent } from "./giddh-daterangepicker.component";
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { GIDDH_DATEPICKER_FORMAT, PickDateAdapter } from "../datepicker-shared/datepicker-adapter";

@NgModule({
    declarations: [
        GiddhDaterangepickerComponent
    ],
    imports: [
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule
    ],
    exports: [
        GiddhDaterangepickerComponent
    ],
    providers: [
        MatDatepickerModule,
        MatNativeDateModule,
        { provide: MAT_DATE_FORMATS, useValue: GIDDH_DATEPICKER_FORMAT },
        { provide: DateAdapter, useClass: PickDateAdapter },
        { provide: LOCALE_ID, useValue: 'en' }
    ]
})

export class GiddhDateRangepickerModule {

}
