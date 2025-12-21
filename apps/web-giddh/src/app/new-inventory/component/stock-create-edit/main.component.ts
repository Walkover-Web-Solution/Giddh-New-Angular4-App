import { Component } from "@angular/core";

@Component({
    selector: "stock-create",
    templateUrl: './main.component.html',
    standalone: false
})
export class MainComponent {
    /* This will hold the boolean value to open/close setting sidebar popup */
    public asideInventorySidebarMenuState: boolean = true;
}
