import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { HamburgerMenuComponent } from "./hamburger-menu.component";

@NgModule({
    imports: [
        CommonModule,
        TooltipModule
    ],
    declarations: [HamburgerMenuComponent],
    exports: [HamburgerMenuComponent]
})
export class HamburgerMenuComponentModule {}