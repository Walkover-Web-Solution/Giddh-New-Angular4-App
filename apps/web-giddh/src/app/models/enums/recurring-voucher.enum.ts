/**
 * Enum for recurring voucher repeat types
 * Defines how often a voucher should recur
 */
export enum RecurringRepeatType {
    EVERY_DAY = 'EVERY_DAY',
    DAY_OF_MONTH = 'DAY_OF_MONTH',
    WEEK_DAYS = 'WEEK_DAYS',
    NTH_WEEKDAY = 'NTH_WEEKDAY'
}

/**
 * Enum for recurring voucher end types
 * Defines when the recurrence should end
 */
export enum RecurringEndType {
    NEVER = 'NEVER',
    ON_DATE = 'ON_DATE'
}

/**
 * Enum for recurring frequency units
 * Defines the time unit for recurrence frequency
 */
export enum RecurringFrequencyUnit {
    DAY = 'DAY',
    WEEK = 'WEEK',
    MONTH = 'MONTH'
}

/**
 * Enum for monthly recurrence mode
 * Defines whether to repeat on a specific day or nth weekday
 */
export enum RecurringMonthlyMode {
    DAY = 'DAY',
    THE = 'THE'
}
