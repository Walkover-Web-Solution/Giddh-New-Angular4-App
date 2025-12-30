import { NgModule } from "@angular/core";
import { A11yModule } from '@angular/cdk/a11y';
import { EnterNextDirective } from "./enter-next.directive";
import { FocusableClickDirective } from "./focusable-click.directive";

@NgModule({
    imports: [A11yModule, EnterNextDirective, FocusableClickDirective],
    exports: [EnterNextDirective, FocusableClickDirective]
})
export class KeyboardNavigationModule { }
