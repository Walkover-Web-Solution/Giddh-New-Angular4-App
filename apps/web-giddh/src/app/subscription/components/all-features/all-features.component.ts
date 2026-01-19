import { Component, Output, EventEmitter } from '@angular/core';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'all-features',
    styleUrls: ['./all-features.component.scss'],
    templateUrl: './all-features.component.html',
    standalone: false
})

/**
 * AllFeaturesComponent component
 * Handles allfeatures functionality and user interactions
 */
export class AllFeaturesComponent {

    @Output() public closeEvent = new EventEmitter<boolean>();
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor() { }

}
