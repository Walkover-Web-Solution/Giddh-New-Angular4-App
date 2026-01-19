import { NgModule } from "@angular/core";
import { A11yModule } from '@angular/cdk/a11y';
import { EnterNextDirective } from "./enter-next.directive";
import { FocusableClickDirective } from "./focusable-click.directive";

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [A11yModule, EnterNextDirective, FocusableClickDirective],
    exports: [EnterNextDirective, FocusableClickDirective]
})
/**
 * KeyboardNavigationModule module
 * Implements KeyboardNavigationModule functionality
 */
export class KeyboardNavigationModule { }
