import { NgModule } from "@angular/core";
import { HasFocusDirective } from "./has-focus.directive";

@NgModule({
    declarations: [HasFocusDirective],
    exports: [HasFocusDirective]
})
export class HasFocusDirectiveModule {}
