import { GiddhCurrencyPipe } from './currencyType.pipe';
import { GeneralService } from './../../../../services/general.service';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [],
    exports: [GiddhCurrencyPipe],
    declarations: [GiddhCurrencyPipe],
    providers: [GeneralService]
})
export class CurrencyModule {

}
