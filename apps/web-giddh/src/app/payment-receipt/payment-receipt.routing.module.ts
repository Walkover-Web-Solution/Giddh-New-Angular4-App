import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NeedsAuthentication } from "../decorators/needsAuthentication";
import { PaymentReceiptComponent } from "./components/create-edit/payment-receipt.component";
import { MainComponent } from "./main.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canActivate: [NeedsAuthentication],
                component: MainComponent,
                children: [
                    { path: '', redirectTo: 'receipt/create', pathMatch: 'full' },
                    { path: ':voucherType/create', component: PaymentReceiptComponent },
                    { path: ':voucherType/edit/:uniqueName/:accountUniqueName', component: PaymentReceiptComponent }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})

export class PaymentReceiptRoutingModule {

}