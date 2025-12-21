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
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class ManufacturingRoutingModule {
}
