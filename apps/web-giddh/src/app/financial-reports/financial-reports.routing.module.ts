import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { FinancialReportsComponent } from './financial-reports.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: FinancialReportsComponent, canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
/**
 * FinancialReportsRoutingModule module
 * Implements FinancialReportsRoutingModule functionality
 */
export class FinancialReportsRoutingModule {
}
