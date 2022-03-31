import { Component } from "@angular/core";

@Component({
    selector: "stock-create",
    templateUrl: './main.component.html'
})
export class MainComponent {
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideInventorySidebarMenuState: string = 'in';
}