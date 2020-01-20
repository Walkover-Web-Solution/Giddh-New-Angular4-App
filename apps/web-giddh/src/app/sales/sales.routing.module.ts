import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { SalesComponent } from './sales.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: SalesComponent, canActivate: [NeedsAuthentication],
                children: [
                    { path: 'purchase', component: SalesComponent, canActivate: [NeedsAuthentication] },
                    { path: 'credit-note', component: SalesComponent, canActivate: [NeedsAuthentication] },
                    { path: 'debit-note', component: SalesComponent, canActivate: [NeedsAuthentication] },
                ]
            },
            { path: ':accUniqueName', component: SalesComponent, canActivate: [NeedsAuthentication] },
            { path: ':accUniqueName/:invoiceNo/:invoiceType', component: SalesComponent, canActivate: [NeedsAuthentication] }
        ])
    ],
    exports: [RouterModule]
})
export class SalesRoutingModule {
}
