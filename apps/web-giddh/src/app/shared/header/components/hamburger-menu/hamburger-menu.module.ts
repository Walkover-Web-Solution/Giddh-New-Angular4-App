import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { HamburgerMenuComponent } from "./hamburger-menu.component";

/**
 * Module for Hamburger menu component
 *
 * @export
 * @class HamburgerMenuModule
 */
@NgModule({
    declarations: [HamburgerMenuComponent],
    imports: [
        CommonModule,
        MatTooltipModule
    ],
    exports: [HamburgerMenuComponent]
})
export class HamburgerMenuModule {}
