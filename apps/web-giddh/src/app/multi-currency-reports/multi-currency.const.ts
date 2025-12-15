export enum ReportType {
    PROFIT_LOSS = 'profit-loss',
    BALANCE_SHEET = 'balance-sheet',
    TRIAL_BALANCE = 'trial-balance',
    CASH_FLOW = 'cash-flow',
    LEDGER = 'ledger',
    GROUP_SUMMARY = 'group-summary'
}

export const MULTI_CURRENCY_CONSTANTS = {
    DEFAULT_CURRENCY: 'INR',
    SUPPORTED_CURRENCIES: ['INR', 'USD', 'EUR', 'GBP', 'AED'],
    EXCHANGE_RATE_PRECISION: 4,
    AMOUNT_PRECISION: 2
};

export interface MultiCurrencyRequest {
    reportType?: ReportType;
    fromDate?: string;
    toDate?: string;
    baseCurrency?: string;
    targetCurrency?: string;
    includeExchangeRates?: boolean;
}
