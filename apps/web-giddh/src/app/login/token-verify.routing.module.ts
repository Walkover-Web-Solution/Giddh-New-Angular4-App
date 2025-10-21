import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TokenVerifyComponent } from "./token-verify.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: TokenVerifyComponent
            }
        ])
    ],
    exports: [RouterModule]
})

export class TokenVerifyRoutingModule {
    
}