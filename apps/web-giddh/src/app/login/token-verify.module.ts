import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { TokenVerifyComponent } from "./token-verify.component";
import { TokenVerifyRoutingModule } from "./token-verify.routing.module";

@NgModule({
    declarations: [
        TokenVerifyComponent

    ],
    imports: [
        TokenVerifyRoutingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TokenVerifyModule {

}
