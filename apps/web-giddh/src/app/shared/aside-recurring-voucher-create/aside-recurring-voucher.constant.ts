// Recurrence Types
export const REPEAT_TYPES = {
    EVERY_DAY: 'EVERY_DAY',
    DAY_OF_MONTH: 'DAY_OF_MONTH',
    WEEK_DAYS: 'WEEK_DAYS',
    NTH_WEEKDAY: 'NTH_WEEKDAY',
    CUSTOM: 'CUSTOM'
} as const;

// End Types
export const END_TYPES = {
    NEVER: 'NEVER',
    ON_DATE: 'ON_DATE'
} as const;

// Frequency Units
export const FREQUENCY_UNITS = {
    MONTH: 'MONTH',
    WEEK: 'WEEK',
    DAY: 'DAY'
} as const;

// Monthly Modes
export const MONTHLY_MODES = {
    DAY: 'DAY',
    THE: 'THE'
} as const;

// Weekday Options
export const WEEKDAY_OPTIONS = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 0, label: 'Sunday' }
] as const;

// Repeat Options
export const REPEAT_OPTIONS = {
    WEEKLY: 'WEEKLY',
    MONTHLY_DATE: 'MONTHLY_DATE',
    MONTHLY_WEEKDAY: 'MONTHLY_WEEKDAY',
    CUSTOM: 'CUSTOM'
} as const;

// Days of Week
export const DAYS_OF_WEEK = {
    SUNDAY: 'Sunday',
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday'
} as const;

export type RepeatType = keyof typeof REPEAT_TYPES;
export type EndType = keyof typeof END_TYPES;
export type FrequencyUnit = keyof typeof FREQUENCY_UNITS;
export type MonthlyMode = keyof typeof MONTHLY_MODES;
export type WeekdayOption = typeof WEEKDAY_OPTIONS[number];
export type RepeatOption = keyof typeof REPEAT_OPTIONS;
