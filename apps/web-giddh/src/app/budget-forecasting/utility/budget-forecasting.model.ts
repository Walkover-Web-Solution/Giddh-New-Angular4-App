/**
 * Enum for forecast granularity options
 * Defines the time intervals for forecast data aggregation
 */
export enum ForecastGranularity {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY'
}

/**
 * Enum for analysis period options
 * Defines the historical time periods used for forecast analysis
 */
export enum AnalysisPeriod {
    LAST_7_DAYS = 'LAST_7_DAYS',
    LAST_30_DAYS = 'LAST_30_DAYS',
    LAST_3_MONTHS = 'LAST_3_MONTHS',
    LAST_6_MONTHS = 'LAST_6_MONTHS',
    LAST_1_YEAR = 'LAST_1_YEAR',
    LIFETIME = 'LIFETIME'
}

/**
 * Interface for forecast request payload
 */
export interface ForecastPayload {
    accountUniqueNames: string[];
    granularity: string;
    analysisPeriod: string;
    forecastLength: number;
}

/**
 * Interface for individual forecast data point
 */
export interface ForecastData {
    date: string;
    predicted_amount: string;
    balance_type: string;
}

/**
 * Interface for forecast summary statistics
 */
export interface ForecastSummary {
    lowest_balance: {
        date: string;
        amount: string;
    };
    highest_inflow: {
        date: string;
        amount: string;
    };
}

/**
 * Interface for complete forecast response
 */
export interface ForecastResponse {
    forecast: ForecastData[];
    summary: ForecastSummary;
}