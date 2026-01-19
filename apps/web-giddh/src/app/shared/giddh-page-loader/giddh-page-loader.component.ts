import { Component, Input } from "@angular/core";

/**
 * Handles Component functionality
 */
@Component({
    selector: 'giddh-page-loader',
    templateUrl: './giddh-page-loader.component.html',
    styleUrls: ['./giddh-page-loader.component.scss'],
    standalone: false
})

/**
 * GiddhPageLoaderComponent component
 * Handles giddhpageloader functionality and user interactions
 */
export class GiddhPageLoaderComponent {
    /** This will hold css classes */
    @Input() public cssClass: string = "";

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor() {

    }
}
