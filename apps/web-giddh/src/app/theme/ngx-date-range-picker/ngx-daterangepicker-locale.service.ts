import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig, LocaleConfig } from './ngx-daterangepicker.config';

@Injectable()
export class NgxDaterangepickerLocaleService {
    constructor(@Inject(LOCALE_CONFIG) private _config: LocaleConfig) {}

    get config() {
        if (!this._config) {
            return DefaultLocaleConfig;
        }

        return {... DefaultLocaleConfig, ...this._config};
    }
}
