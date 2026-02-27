import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GIDDH_DATE_UI_FORMAT } from '../helpers/defaultDateFormat';

/**
 * Pipe to parse and format dates in Giddh application
 * Handles DD-MM-YYYY string format and converts to formatted date string
 * Can be used in templates and TypeScript code
 */
@Pipe({
    name: 'giddhDate',
    standalone: true
})
export class GiddhDatePipe implements PipeTransform {
    private datePipe = new DatePipe('en-US');

    /**
     * Transforms a date string in DD-MM-YYYY format to formatted date string
     *
     * @param {string | Date | null} value - Date string in DD-MM-YYYY format or Date object
     * @param {string} format - Optional date format (defaults to GIDDH_DATE_UI_FORMAT)
     * @param {boolean} hideCurrentYear - If true, hides year when it matches current year (default: true)
     * @returns {string | null} Formatted date string or null if invalid
     */
    transform(value: string | Date | null, format?: string, hideCurrentYear: boolean = true): string | null {
        if (!value) return null;

        let dateFormat = format || GIDDH_DATE_UI_FORMAT;
        let dateObject: Date | null = null;

        if (value instanceof Date) {
            dateObject = value;
        } else if (typeof value === 'string') {
            dateObject = this.parseDateString(value);
        }

        if (!dateObject || isNaN(dateObject.getTime())) {
            return null;
        }

        if (hideCurrentYear && this.isCurrentYear(dateObject)) {
            dateFormat = this.getFormatWithoutYear(dateFormat);
        }

        return this.datePipe.transform(dateObject, dateFormat);
    }

    /**
     * Checks if the given date is in the current year
     *
     * @private
     * @param {Date} date - Date to check
     * @returns {boolean} True if date is in current year
     */
    private isCurrentYear(date: Date): boolean {
        const currentYear = new Date().getFullYear();
        return date.getFullYear() === currentYear;
    }

    /**
     * Removes year from date format string
     *
     * @private
     * @param {string} format - Original date format
     * @returns {string} Format without year
     */
    private getFormatWithoutYear(format: string): string {
        return format
            .replace(/[,\s]*y{1,4}[,\s]*/gi, '')
            .replace(/[,\s]*Y{1,4}[,\s]*/g, '')
            .replace(/^[,\s]+|[,\s]+$/g, '')
            .trim();
    }

    /**
     * Parses a date string in DD-MM-YYYY format to a Date object
     *
     * @private
     * @param {string} dateString - Date string in DD-MM-YYYY format
     * @returns {Date | null} Parsed Date object or null if invalid
     */
    private parseDateString(dateString: string): Date | null {
        if (!dateString) return null;

        const separator = dateString.includes('/') ? '/' : '-';
        const parts = dateString.split(separator);
        if (parts.length !== 3) return null;

        const [day, month, year] = parts;
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        return isNaN(date.getTime()) ? null : date;
    }

    /**
     * Static method to parse date string for use in TypeScript
     *
     * @static
     * @param {string} dateString - Date string in DD-MM-YYYY format
     * @returns {Date | null} Parsed Date object or null if invalid
     */
    static parseDate(dateString: string): Date | null {
        if (!dateString) return null;

        const separator = dateString.includes('/') ? '/' : '-';
        const parts = dateString.split(separator);
        if (parts.length !== 3) return null;

        const [day, month, year] = parts;
        const date = new Date(Number(year), Number(month) - 1, Number(day));

        return isNaN(date.getTime()) ? null : date;
    }

    /**
     * Static method to format date for use in TypeScript
     *
     * @static
     * @param {string | Date} value - Date string in DD-MM-YYYY format or Date object
     * @param {string} format - Optional date format (defaults to GIDDH_DATE_UI_FORMAT)
     * @param {boolean} hideCurrentYear - If true, hides year when it matches current year (default: true)
     * @returns {string | null} Formatted date string or null if invalid
     */
    static formatDate(value: string | Date, format?: string, hideCurrentYear: boolean = true): string | null {
        const pipe = new GiddhDatePipe();
        return pipe.transform(value, format, hideCurrentYear);
    }
}
