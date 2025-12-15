import { LOCALE_ID, NgModule } from "@angular/core";
import { GiddhDatepickerComponent } from "./giddh-datepicker.component";
import localeEn from '@angular/common/locales/en-GB';
import localeHi from '@angular/common/locales/hi';
import localeMr from '@angular/common/locales/mr';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, NativeDateAdapter } from "@angular/material/core";
import { CommonModule, formatDate, registerLocaleData } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

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
    parse(value: any, parseFormat: string | any): Date | null {
        if (typeof value === 'string') {
            const parts = value.split('-');
            if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
                const year = parseInt(parts[2], 10);
                const date = new Date(year, month, day);
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
        }
        return super.parse(value, parseFormat); // Fallback to default parsing
    }

    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            return formatDate(date, 'dd-MM-yyyy', this.locale);
        } else {
            return formatDate(date, 'MMM dd, yyyy', this.locale);
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