import { GeneralService } from './../../../../services/general.service';
import { NgModule } from '@angular/core';
import { GiddhCurrencyPipe } from './currency.pipe';
@NgModule({
  imports: [],
  exports: [GiddhCurrencyPipe],
  declarations: [GiddhCurrencyPipe],
  providers: [GeneralService]
})
export class CurrencyModule {

}
