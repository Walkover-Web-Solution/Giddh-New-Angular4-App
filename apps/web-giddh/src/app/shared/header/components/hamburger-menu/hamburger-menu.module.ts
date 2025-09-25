import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TooltipModule } from "ngx-bootstrap/tooltip";
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
        TooltipModule.forRoot()
    ],
    exports: [HamburgerMenuComponent]
})
export class HamburgerMenuModule {}
