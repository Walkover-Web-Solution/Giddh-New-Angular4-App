import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TokenVerifyComponent } from "./token-verify.component";

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([ { path: '',
        component: TokenVerifyComponent }
    
        ])
    ],
    exports: [
        RouterModule
    ]
})

/**
 * TokenVerifyRoutingModule module
 * Implements TokenVerifyRoutingModule functionality
 */
export class TokenVerifyRoutingModule {
    
}