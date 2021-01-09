import { GiddhCurrencyPipe } from './currencyType.pipe';
import { NgModule } from '@angular/core';
import { ServiceModule } from 'apps/web-giddh/src/app/services/service.module';

@NgModule({
    imports: [ServiceModule],
    exports: [GiddhCurrencyPipe],
    declarations: [GiddhCurrencyPipe],
    providers: []
})
export class CurrencyModule {

}
