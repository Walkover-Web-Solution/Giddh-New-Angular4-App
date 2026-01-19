import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig, LocaleConfig } from './ngx-daterangepicker.config';

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * NgxDaterangepickerLocaleService service
 * Provides ngxdaterangepickerlocale related business logic and data operations
 */
export class NgxDaterangepickerLocaleService {
    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(@Inject(LOCALE_CONFIG) private _config: LocaleConfig) { }

    get config() {
        /**
         * Handles if functionality
         */
        if (!this._config) {
            return DefaultLocaleConfig;
        }

        return { ...DefaultLocaleConfig, ...this._config };
    }
}
