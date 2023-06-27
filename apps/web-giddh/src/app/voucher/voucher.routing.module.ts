import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { VoucherRendererComponent } from './voucher-renderer.component';
import { VoucherComponent } from './voucher.component';
import { PageLeaveConfirmationGuard } from '../decorators/page-leave-confirmation-guard';

const routes: Routes = [
    {
        path: '',
        component: VoucherRendererComponent,
        children: [
            {
                path: '', redirectTo: 'invoice/proformas', pathMatch: 'full'
            },
            {
                path: 'invoice/:invoiceType', component: VoucherComponent, canActivate: [NeedsAuthentication], canDeactivate: [PageLeaveConfirmationGuard]
            },
            {
                path: 'invoice/:invoiceType/:accUniqueName', component: VoucherComponent, canActivate: [NeedsAuthentication], canDeactivate: [PageLeaveConfirmationGuard]
            },
            {
                path: 'invoice/:invoiceType/:accUniqueName/:invoiceNo', component: VoucherComponent, canActivate: [NeedsAuthentication], canDeactivate: [PageLeaveConfirmationGuard]
            },
            {
                path: 'invoice/:invoiceType/:accUniqueName/:invoiceNo/:invoiceAction', component: VoucherComponent, canActivate: [NeedsAuthentication], canDeactivate: [PageLeaveConfirmationGuard]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class VoucherRoutingModule {
}
