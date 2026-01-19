import { NativeDateAdapter } from '@angular/material/core';
import { formatDate, registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeHi from '@angular/common/locales/hi';
import localeMr from '@angular/common/locales/mr';

registerLocaleData(localeEn);
registerLocaleData(localeHi);
registerLocaleData(localeMr);

export const GIDDH_DATEPICKER_FORMAT = {
  parse: {
    dateInput: [
      'MM/DD/YYYY',
      'M/D/YY',
      'MMM DD YYYY',
      'MMM DD YY',
      'DD MMM YYYY',
      'DD MMM YY',
      'DD/MM/YYYY',
      'YYYY-MM-DD',
      'YYYY/MM/DD',
      'MM-DD-YYYY',
      'MMMM D, YYYY',
      'DD MMMM YYYY',
    ],
  },
  display: {
    dateInput: 'MMM dd, yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

export class PickDateAdapter extends NativeDateAdapter {
    private readonly monthMap = new Map([
        ['jan', 0], ['january', 0], ['feb', 1], ['february', 1],
        ['mar', 2], ['march', 2], ['apr', 3], ['april', 3],
        ['may', 4], ['jun', 5], ['june', 5], ['jul', 6], ['july', 6],
        ['aug', 7], ['august', 7], ['sep', 8], ['september', 8],
        ['oct', 9], ['october', 9], ['nov', 10], ['november', 10],
        ['dec', 11], ['december', 11]
    ]);

    private readonly formatPatterns = [
        { format: 'MM/DD/YYYY', regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, parser: (m: RegExpMatchArray) => [parseInt(m[3]), parseInt(m[1]) - 1, parseInt(m[2])] },
        { format: 'M/D/YY', regex: /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/, parser: (m: RegExpMatchArray) => [this.expandYear(parseInt(m[3])), parseInt(m[1]) - 1, parseInt(m[2])] },
        { format: 'DD/MM/YYYY', regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, parser: (m: RegExpMatchArray) => [parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1])] },
        { format: 'YYYY-MM-DD', regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, parser: (m: RegExpMatchArray) => [parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3])] },
        { format: 'YYYY/MM/DD', regex: /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, parser: (m: RegExpMatchArray) => [parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3])] },
        { format: 'MM-DD-YYYY', regex: /^(\d{1,2})-(\d{1,2})-(\d{4})$/, parser: (m: RegExpMatchArray) => [parseInt(m[3]), parseInt(m[1]) - 1, parseInt(m[2])] }
    ];

    parse(value: any, parseFormat: string | any): Date | null {
        if (!value || typeof value !== 'string') return null;

        const trimmed = value.trim();
        if (!trimmed) return null;

        const numericResult = this.parseNumericFormats(trimmed);
        if (numericResult) return numericResult;

        const textResult = this.parseTextFormats(trimmed);
        if (textResult) return textResult;

        return super.parse(value, parseFormat);
    }

    private parseNumericFormats(value: string): Date | null {
        for (const pattern of this.formatPatterns) {
            const match = value.match(pattern.regex);
            if (match) {
                const [year, month, day] = pattern.parser(match);
                return this.createValidDate(year, month, day);
            }
        }
        return null;
    }

    private parseTextFormats(value: string): Date | null {
        let match = value.match(/^(\w{3})\s+(\d{1,2})\s+(\d{4})$/);
        if (match) {
            const month = this.getMonthIndex(match[1]);
            if (month !== null) {
                return this.createValidDate(parseInt(match[3]), month, parseInt(match[2]));
            }
        }

        match = value.match(/^(\w{3})\s+(\d{1,2})\s+(\d{2})$/);
        if (match) {
            const month = this.getMonthIndex(match[1]);
            if (month !== null) {
                return this.createValidDate(this.expandYear(parseInt(match[3])), month, parseInt(match[2]));
            }
        }

        match = value.match(/^(\d{1,2})\s+(\w{3})\s+(\d{4})$/);
        if (match) {
            const month = this.getMonthIndex(match[2]);
            if (month !== null) {
                return this.createValidDate(parseInt(match[3]), month, parseInt(match[1]));
            }
        }

        match = value.match(/^(\d{1,2})\s+(\w{3})\s+(\d{2})$/);
        if (match) {
            const month = this.getMonthIndex(match[2]);
            if (month !== null) {
                return this.createValidDate(this.expandYear(parseInt(match[3])), month, parseInt(match[1]));
            }
        }

        match = value.match(/^(\w+)\s+(\d{1,2}),\s+(\d{4})$/);
        if (match) {
            const month = this.getMonthIndex(match[1]);
            if (month !== null) {
                return this.createValidDate(parseInt(match[3]), month, parseInt(match[2]));
            }
        }

        match = value.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/);
        if (match) {
            const month = this.getMonthIndex(match[2]);
            if (month !== null) {
                return this.createValidDate(parseInt(match[3]), month, parseInt(match[1]));
            }
        }

        return null;
    }

    private expandYear(year: number): number {
        return year < 50 ? 2000 + year : 1900 + year;
    }

    private getMonthIndex(monthStr: string): number | null {
        return this.monthMap.get(monthStr.toLowerCase()) ?? null;
    }

    private createValidDate(year: number, month: number, day: number): Date | null {
        if (year < 1900 || year > 2100 || month < 0 || month > 11 || day < 1 || day > 31) return null;

        const date = new Date(year, month, day);
        
        return (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) ? date : null;
    }

    format(date: Date, displayFormat: string): string {
        if (!date || isNaN(date.getTime())) return '';

        const config = GIDDH_DATEPICKER_FORMAT.display;
        const formatMap: { [key: string]: string } = {
            'input': config.dateInput,
            'monthYearLabel': config.monthYearLabel,
            'dateA11yLabel': config.dateA11yLabel,
            'monthYearA11yLabel': config.monthYearA11yLabel
        };
        
        return formatDate(date, formatMap[displayFormat] || config.dateInput, this.locale);
    }
}
