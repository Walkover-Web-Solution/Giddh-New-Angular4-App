import { NativeDateAdapter } from "@angular/material/core";
import { formatDate } from "@angular/common";

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
      // names are not standard Angular Material date format tokens and will likely fail.
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
    dateInput: 'MMM dd, yyyy', // Example: Dec 12, 2025
    
    // Format for the month/year view in the calendar header
    monthYearLabel: 'MMM yyyy', // Example: Dec 2025
    
    // Accessibility label for the selected date
    dateA11yLabel: 'LL', 
    
    // Accessibility label for the month/year view
    monthYearA11yLabel: 'MMMM yyyy', // Example: December 2025
  },
};

export class PickDateAdapter extends NativeDateAdapter {
    /** Ordered month names for prefix-based matching */
    private readonly monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    /** Date format patterns with their corresponding regex */
    private readonly formatPatterns = [
        { format: 'MM/DD/YYYY', regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, parser: (m: RegExpMatchArray) => [parseInt(m[3]), parseInt(m[1]) - 1, parseInt(m[2])] },
        { format: 'M/D/YY', regex: /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/, parser: (m: RegExpMatchArray) => [this.expandYear(parseInt(m[3])), parseInt(m[1]) - 1, parseInt(m[2])] },
        { format: 'DD/MM/YYYY', regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, parser: (m: RegExpMatchArray) => [parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1])] },
        { format: 'YYYY-MM-DD', regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, parser: (m: RegExpMatchArray) => [parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3])] },
        { format: 'YYYY/MM/DD', regex: /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, parser: (m: RegExpMatchArray) => [parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3])] },
        { format: 'MM-DD-YYYY', regex: /^(\d{1,2})-(\d{1,2})-(\d{4})$/, parser: (m: RegExpMatchArray) => [parseInt(m[3]), parseInt(m[1]) - 1, parseInt(m[2])] }
    ];

    /**
     * Parses user input into a Date object with support for multiple formats
     *
     * @param {any} value - The input value to parse
     * @param {string | any} parseFormat - The format configuration or format string
     * @returns {Date | null} Parsed date or null if invalid
     * @memberof PickDateAdapter
     */
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

    /**
     * Parses numeric date formats efficiently
     *
     * @private
     * @param {string} value - The date string to parse
     * @returns {Date | null} Parsed date or null if invalid
     * @memberof PickDateAdapter
     */
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

    /**
     * Parses text-based date formats
     *
     * @private
     * @param {string} value - The date string to parse
     * @returns {Date | null} Parsed date or null if invalid
     * @memberof PickDateAdapter
     */
    private parseTextFormats(value: string): Date | null {
        // MMM DD YYYY (Dec 12 2025)
        let match = value.match(/^(\w{3})\s+(\d{1,2})\s+(\d{4})$/);
        if (match) {
            const month = this.getMonthIndex(match[1]);
            if (month !== null) {
                return this.createValidDate(parseInt(match[3]), month, parseInt(match[2]));
            }
        }

        // MMM DD YY (Dec 12 25)
        match = value.match(/^(\w{3})\s+(\d{1,2})\s+(\d{2})$/);
        if (match) {
            const month = this.getMonthIndex(match[1]);
            if (month !== null) {
                return this.createValidDate(this.expandYear(parseInt(match[3])), month, parseInt(match[2]));
            }
        }

        // DD MMM YYYY (12 Dec 2025)
        match = value.match(/^(\d{1,2})\s+(\w{3})\s+(\d{4})$/);
        if (match) {
            const month = this.getMonthIndex(match[2]);
            if (month !== null) {
                return this.createValidDate(parseInt(match[3]), month, parseInt(match[1]));
            }
        }

        // DD MMM YY (12 Dec 25)
        match = value.match(/^(\d{1,2})\s+(\w{3})\s+(\d{2})$/);
        if (match) {
            const month = this.getMonthIndex(match[2]);
            if (month !== null) {
                return this.createValidDate(this.expandYear(parseInt(match[3])), month, parseInt(match[1]));
            }
        }

        // MMMM D, YYYY (December 12, 2025)
        match = value.match(/^(\w+)\s+(\d{1,2}),\s+(\d{4})$/);
        if (match) {
            const month = this.getMonthIndex(match[1]);
            if (month !== null) {
                return this.createValidDate(parseInt(match[3]), month, parseInt(match[2]));
            }
        }

        // DD MMMM YYYY (12 December 2025)
        match = value.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/);
        if (match) {
            const month = this.getMonthIndex(match[2]);
            if (month !== null) {
                return this.createValidDate(parseInt(match[3]), month, parseInt(match[1]));
            }
        }

        const currentYear = new Date().getFullYear();

        // DD MMM (12 Jan) - no year, use current year
        match = value.match(/^(\d{1,2})\s+(\w+)$/);
        if (match) {
            const month = this.getMonthIndex(match[2]);
            if (month !== null) {
                return this.createValidDate(currentYear, month, parseInt(match[1]));
            }
        }

        // MMM DD (Jan 12) - no year, use current year
        match = value.match(/^(\w+)\s+(\d{1,2})$/);
        if (match) {
            const month = this.getMonthIndex(match[1]);
            if (month !== null) {
                return this.createValidDate(currentYear, month, parseInt(match[2]));
            }
        }

        // DDMMMYYYYor DDMMMYY compact (12jan2025, 12jan25, 12j23) - no spaces
        // Try 4-digit year first, then 2-digit to avoid ambiguity
        match = value.match(/^(\d{1,2})([a-zA-Z]{1,})(\d{4})$/) ||
                value.match(/^(\d{1,2})([a-zA-Z]{1,})(\d{2})$/);
        if (match) {
            const month = this.getMonthIndex(match[2]);
            if (month !== null) {
                const yr = match[3].length === 2 ? this.expandYear(parseInt(match[3])) : parseInt(match[3]);
                return this.createValidDate(yr, month, parseInt(match[1]));
            }
        }

        // MMMDDYYYYor MMMDDYY compact (jan122025, jan1225, j1223) - no spaces
        // Use explicit 4-digit then 2-digit year to avoid greedy digit ambiguity
        match = value.match(/^([a-zA-Z]{1,})(\d{1,2})(\d{4})$/) ||
                value.match(/^([a-zA-Z]{1,})(\d{2})(\d{2})$/);
        if (match) {
            const month = this.getMonthIndex(match[1]);
            if (month !== null) {
                const yr = match[3].length === 2 ? this.expandYear(parseInt(match[3])) : parseInt(match[3]);
                return this.createValidDate(yr, month, parseInt(match[2]));
            }
        }

        // DDMMM compact (12jan, 12j, 12ju) - no year, no spaces, use current year
        match = value.match(/^(\d{1,2})([a-zA-Z]{1,})$/);
        if (match) {
            const month = this.getMonthIndex(match[2]);
            if (month !== null) {
                return this.createValidDate(currentYear, month, parseInt(match[1]));
            }
        }

        // MMMDD compact (jan12, j12, ju12) - no year, no spaces, use current year
        match = value.match(/^([a-zA-Z]{1,})(\d{1,2})$/);
        if (match) {
            const month = this.getMonthIndex(match[1]);
            if (month !== null) {
                return this.createValidDate(currentYear, month, parseInt(match[2]));
            }
        }

        return null;
    }

    /**
     * Expands 2-digit year to 4-digit year
     *
     * @private
     * @param {number} year - 2-digit year
     * @returns {number} 4-digit year
     * @memberof PickDateAdapter
     */
    private expandYear(year: number): number {
        return year < 50 ? 2000 + year : 1900 + year;
    }

    /**
     * Gets month index from a month name, abbreviation, or prefix (minimum 1 char).
     * Returns the first calendar month whose name starts with the given prefix.
     * e.g. "j" → January (0), "ju" → June (5), "jul" → July (6), "d" → December (11)
     *
     * @private
     * @param {string} monthStr - Month name, abbreviation, or prefix
     * @returns {number | null} Month index (0-11) or null if no match
     * @memberof PickDateAdapter
     */
    private getMonthIndex(monthStr: string): number | null {
        if (!monthStr) return null;
        const prefix = monthStr.toLowerCase();
        const index = this.monthNames.findIndex(name => name.startsWith(prefix));
        return index !== -1 ? index : null;
    }

    /**
     * Creates a valid Date object with validation
     *
     * @private
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @param {number} day - Day
     * @returns {Date | null} Valid date or null if invalid
     * @memberof PickDateAdapter
     */
    private createValidDate(year: number, month: number, day: number): Date | null {
        if (year < 1900 || year > 2100 || month < 0 || month > 11 || day < 1 || day > 31) return null;

        const date = new Date(year, month, day);
        
        return (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) ? date : null;
    }

    /**
     * Formats a Date object into a string based on the display format
     *
     * @param {Date} date - The date to format
     * @param {string} displayFormat - The format key from display configuration
     * @returns {string} Formatted date string
     * @memberof PickDateAdapter
     */
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
