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
                    { path: '', redirectTo: 'create', pathMatch: 'full' },
                    { path: 'create', component: PaymentReceiptComponent }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})

export class PaymentReceiptRoutingModule {

}