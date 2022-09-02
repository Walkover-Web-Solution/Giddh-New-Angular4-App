import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UserAuthenticated } from "../decorators/UserAuthenticated";
import { TokenVerifyComponent } from "./token-verify.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: TokenVerifyComponent, canActivate: [UserAuthenticated]
            }
        ])
    ],
    exports: [RouterModule]
})

export class TokenVerifyRoutingModule {
    
}