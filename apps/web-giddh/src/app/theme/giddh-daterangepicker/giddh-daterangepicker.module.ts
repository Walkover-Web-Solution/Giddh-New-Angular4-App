import { LOCALE_ID, NgModule } from "@angular/core";
import localeEn from '@angular/common/locales/en-GB';
import localeHi from '@angular/common/locales/hi';
import localeMr from '@angular/common/locales/mr';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, NativeDateAdapter } from "@angular/material/core";
import { formatDate, registerLocaleData } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { GiddhDaterangepickerComponent } from "./giddh-daterangepicker.component";

registerLocaleData(localeEn);
registerLocaleData(localeHi);
registerLocaleData(localeMr);

// export const GIDDH_DATEPICKER_FORMAT = {
//     parse: { dateInput: 'dd-MM-yyyy' },
//     display: {
//         dateInput: 'input'
//     }
// };
export const GIDDH_DATEPICKER_FORMAT = {
  // 1. PARSING CONFIGURATION (Keyboard Input)
  // This is an array of strings. The datepicker will try to parse the user's
  // typed input against each format in this array until a match is found.
  parse: {
    dateInput: [
      // ------------------------------------
      // YOUR SUGGESTED SHORTCUTS
      // ------------------------------------
      'MM/DD/YYYY',   // Handles: 10/12/2025 (Month/Day/Full Year)
      'M/D/YY',       // Handles: 1/2/25 (Shortest numeric input)
      'MMM DD YYYY',  // Handles: Dec 12 2025 (Abbreviated Month, Day, Full Year)
      'MMM DD YY',    // Handles: Dec 12 25 (Abbreviated Month, Day, Two-digit Year)
      'DD MMM YYYY',  // Handles: 12 Dec 2025 (Day, Abbreviated Month, Full Year)
      'DD MMM YY',    // Handles: 12 Dec 25 (Day, Abbreviated Month, Two-digit Year)

      // Note on 'd 12 25' and '12 d 25': Single letters like 'd' for month 
      // names are not standard Moment.js tokens and will likely fail. 
      // The `MMM` tokens above cover the most flexible abbreviations.

      // ------------------------------------
      // COMMON NUMERIC FORMATS
      // ------------------------------------
      'DD/MM/YYYY',   // Handles: 12/10/2025 (Day/Month/Full Year - European/International)
      'YYYY-MM-DD',   // Handles: 2025-12-10 (ISO Standard)
      'YYYY/MM/DD',   // Handles: 2025/12/10
      'MM-DD-YYYY',   // Handles: 10-12-2025

      // ------------------------------------
      // COMMON WORD/READABLE FORMATS
      // ------------------------------------
      'MMMM D, YYYY', // Handles: December 12, 2025 (Full Month Name)
      'DD MMMM YYYY', // Handles: 12 December 2025 (Day, Full Month Name)
    ],
  },
  
  // 2. DISPLAY CONFIGURATION (Visual Output)
  // This defines the format of the date once it is selected and displayed in the input field.
  // You should typically choose only ONE preferred display format.
  display: {
    // Format for the input field after selection (the most readable option is recommended)
    dateInput: 'MMM DD, YYYY', // Example: Dec 12, 2025
    
    // Format for the month/year view in the calendar header
    monthYearLabel: 'MMM YYYY', // Example: Dec 2025
    
    // Accessibility label for the selected date
    dateA11yLabel: 'LL', 
    
    // Accessibility label for the month/year view
    monthYearA11yLabel: 'MMMM YYYY', // Example: December 2025
  },
};

export class PickDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            if (displayFormat === 'input') {
                return formatDate(date, 'dd-MM-yyyy', this.locale) || formatDate(date, 'MM/dd/yyyy', this.locale);
            } else {
                return formatDate(date, 'MMM yyyy', this.locale);
            }
        } else {
            return formatDate(date, 'MMM yyyy', this.locale);
        }
    }
}

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
