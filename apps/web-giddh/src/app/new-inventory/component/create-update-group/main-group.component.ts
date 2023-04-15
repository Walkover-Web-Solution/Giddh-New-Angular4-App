import { Component } from "@angular/core";

@Component({
    selector: "group-create",
    templateUrl: './main-group.component.html'
})
export class MainGroupComponent {
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideInventorySidebarMenuState: string = 'in';
}
