import { LOCALE_ID, NgModule } from "@angular/core";
import localeEn from '@angular/common/locales/en-GB';
import localeHi from '@angular/common/locales/hi';
import localeMr from '@angular/common/locales/mr';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";
import { registerLocaleData } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { GiddhDaterangepickerComponent } from "./giddh-daterangepicker.component";
import { GIDDH_DATEPICKER_FORMAT, PickDateAdapter } from "../giddh-date-adapter/giddh-date-adapter";

registerLocaleData(localeEn);
registerLocaleData(localeHi);
registerLocaleData(localeMr);


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
