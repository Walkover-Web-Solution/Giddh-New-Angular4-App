import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VatReportComponent } from './vatReport.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: VatReportComponent, children: [
                    //   {path: '', redirectTo: 'select'},
                    //   {path: 'vat-list', component: VatReportListComponent},
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class VatReportRoutingModule {
}
