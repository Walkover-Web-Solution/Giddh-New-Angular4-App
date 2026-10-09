import { LOCALE_ID, NgModule } from "@angular/core";
import { GiddhDatepickerComponent } from "./giddh-datepicker.component";
import localeEn from '@angular/common/locales/en-GB';
import localeHi from '@angular/common/locales/hi';
import localeMr from '@angular/common/locales/mr';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";
import { CommonModule, registerLocaleData } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { GIDDH_DATEPICKER_FORMAT, PickDateAdapter } from "../giddh-date-adapter/giddh-date-adapter";

registerLocaleData(localeEn);
registerLocaleData(localeHi);
registerLocaleData(localeMr);


@NgModule({
    declarations: [
        GiddhDatepickerComponent
    ],
    imports: [
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        CommonModule
    ],
    exports: [
        GiddhDatepickerComponent
    ],
    providers: [
        MatDatepickerModule,
        MatNativeDateModule,
        { provide: MAT_DATE_FORMATS, useValue: GIDDH_DATEPICKER_FORMAT },
        { provide: DateAdapter, useClass: PickDateAdapter },
        { provide: LOCALE_ID, useValue: 'en' }
    ]
})

export class GiddhDatepickerModule {

}