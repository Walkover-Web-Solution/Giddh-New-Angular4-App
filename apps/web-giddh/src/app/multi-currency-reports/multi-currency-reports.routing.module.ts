import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { MultiCurrencyReportsComponent } from './multi-currency-reports.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: MultiCurrencyReportsComponent, canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
export class MultiCurrencyReportsRoutingModule {
}
