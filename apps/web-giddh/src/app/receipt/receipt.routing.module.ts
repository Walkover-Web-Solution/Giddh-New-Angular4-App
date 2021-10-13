import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NeedsAuthentication } from "../decorators/needsAuthentication";
import { CreateReceiptComponent } from "./components/create/create-receipt.component";
import { ReceiptComponent } from "./receipt.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canActivate: [NeedsAuthentication],
                component: ReceiptComponent,
                children: [
                    { path: '', redirectTo: 'create', pathMatch: 'full' },
                    { path: 'create', component: CreateReceiptComponent }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})

export class ReceiptRoutingModule {
    
}