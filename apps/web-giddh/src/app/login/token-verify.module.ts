import { NgModule } from "@angular/core";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { TokenVerifyComponent } from "./token-verify.component";
import { TokenVerifyRoutingModule } from "./token-verify.routing.module";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        TokenVerifyComponent
    ],
    imports: [
        TokenVerifyRoutingModule,
        GiddhPageLoaderModule
    ]
})

/**
 * TokenVerifyModule module
 * Implements TokenVerifyModule functionality
 */
export class TokenVerifyModule {

}
