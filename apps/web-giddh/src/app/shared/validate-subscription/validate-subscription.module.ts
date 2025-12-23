import { NgModule } from "@angular/core";
import { ValidateSubscriptionDirective } from "./validate-subscription-directive";

@NgModule({
    declarations: [ValidateSubscriptionDirective],
    exports: [ValidateSubscriptionDirective]
})
export class ValidateSubscriptionDirectiveModule { }
