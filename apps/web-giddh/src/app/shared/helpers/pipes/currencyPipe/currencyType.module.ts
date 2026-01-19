import { GiddhCurrencyPipe } from './currencyType.pipe';
import { NgModule } from '@angular/core';
import { ServiceModule } from 'apps/web-giddh/src/app/services/service.module';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [ServiceModule],
    exports: [GiddhCurrencyPipe],
    declarations: [GiddhCurrencyPipe],
    providers: []
})
/**
 * CurrencyModule module
 * Implements CurrencyModule functionality
 */
export class CurrencyModule {

}
