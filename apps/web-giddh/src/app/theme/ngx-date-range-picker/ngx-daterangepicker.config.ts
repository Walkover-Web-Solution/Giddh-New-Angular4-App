import { InjectionToken } from '@angular/core';
import * as dayjs from 'dayjs';
import * as localeData from 'dayjs/plugin/localeData' // load on demand
dayjs.extend(localeData) // use plugin
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';

export const LOCALE_CONFIG = new InjectionToken<LocaleConfig>('daterangepicker.config');

/**
 *  LocaleConfig Interface
 */
export interface LocaleConfig {
    direction?: string;
    separator?: string;
    weekLabel?: string;
    applyLabel?: string;
    cancelLabel?: string;
    customRangeLabel?: string;
    daysOfWeek?: string[];
    monthNames?: string[];
    firstDay?: number;
    format?: string;
}

/**
 *  DefaultLocaleConfig
 */
export const DefaultLocaleConfig: LocaleConfig = {
    direction: 'ltr',
    separator: '-',
    weekLabel: 'W',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    customRangeLabel: 'Custom range',
    daysOfWeek: dayjs.weekdaysMin(),
    monthNames: dayjs.monthsShort(),
    firstDay: dayjs.localeData().firstDayOfWeek(),
    format: GIDDH_DATE_FORMAT
};
