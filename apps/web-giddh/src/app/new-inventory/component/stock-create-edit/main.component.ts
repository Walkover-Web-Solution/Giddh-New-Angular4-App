import { Component } from "@angular/core";

@Component({
    selector: 'main',
standalone: false,
    templateUrl: './main.component.html'
})
export class MainComponent {
    /* This will hold the boolean value to open/close setting sidebar popup */
    public asideInventorySidebarMenuState: boolean = true;
}