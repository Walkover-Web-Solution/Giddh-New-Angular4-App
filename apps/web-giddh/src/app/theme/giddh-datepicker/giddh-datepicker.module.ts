import { LOCALE_ID, NgModule } from "@angular/core";
import { GiddhDatepickerComponent } from "./giddh-datepicker.component";
import localeEn from '@angular/common/locales/en-GB';
import localeHi from '@angular/common/locales/hi';
import localeMr from '@angular/common/locales/mr';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, NativeDateAdapter } from "@angular/material/core";
import { CommonModule, formatDate, registerLocaleData } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";

registerLocaleData(localeEn);
registerLocaleData(localeHi);
registerLocaleData(localeMr);

export const GIDDH_DATEPICKER_FORMAT = {
    parse: { dateInput: 'dd-MM-yyyy' },
    display: {
        dateInput: 'input'
    }
};

export class PickDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            return formatDate(date, 'dd-MM-yyyy', this.locale);
        } else {
            return formatDate(date, 'MMM yyyy', this.locale);
        }
    }
}

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