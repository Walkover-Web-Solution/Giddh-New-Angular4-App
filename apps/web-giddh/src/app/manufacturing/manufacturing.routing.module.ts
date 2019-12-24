import { ManufacturingComponent } from './manufacturing.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { MfEditComponent } from './edit/mf.edit.component';
import { MfReportComponent } from './report/mf.report.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: ManufacturingComponent, canActivate: [NeedsAuthentication],
                children: [
                    { path: '', redirectTo: 'report', pathMatch: 'full' },
                    { path: 'report', component: MfReportComponent },
                    { path: 'edit', component: MfEditComponent }

                    // { path: 'add-group', pathMatch: 'full', component: InventoryAddGroupComponent, canActivate: [NeedsAuthentication] },
                    // { path: 'add-group/:groupUniqueName', component: InventoryAddGroupComponent, canActivate: [NeedsAuthentication], },
                    // { path: 'add-group/:groupUniqueName/add-stock', component: InventoryAddStockComponent, canActivate: [NeedsAuthentication] },
                    // { path: 'add-group/:groupUniqueName/add-stock/:stockUniqueName', component: InventoryAddStockComponent, canActivate: [NeedsAuthentication] },
                    // { path: 'add-group/:groupUniqueName/stock-report/:stockUniqueName', component: InventoryStockReportComponent, canActivate: [NeedsAuthentication] },
                    // { path: 'custom-stock', component: InventoryCustomStockComponent, canActivate: [NeedsAuthentication] },
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class ManufacturingRoutingModule {
}
