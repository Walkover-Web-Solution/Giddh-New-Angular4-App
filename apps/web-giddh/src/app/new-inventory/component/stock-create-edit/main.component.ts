import { Component } from "@angular/core";

/**
 * Handles Component functionality
 */
@Component({
    selector: "stock-create",
    templateUrl: './main.component.html',
    standalone: false
})
/**
 * MainComponent component
 * Handles main functionality and user interactions
 */
export class MainComponent {
    /* This will hold the boolean value to open/close setting sidebar popup */
    public asideInventorySidebarMenuState: boolean = true;
}
