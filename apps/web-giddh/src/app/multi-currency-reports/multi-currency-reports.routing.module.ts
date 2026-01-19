import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { MultiCurrencyReportsComponent } from './multi-currency-reports.component';

/**
 * Handles NgModule functionality
 */
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
/**
 * MultiCurrencyReportsRoutingModule module
 * Implements MultiCurrencyReportsRoutingModule functionality
 */
export class MultiCurrencyReportsRoutingModule {
}
