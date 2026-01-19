import { Component } from '@angular/core';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'reports',
    standalone:false,
    template: '<router-outlet></router-outlet>'
})
/**
 * ReportsComponent component
 * Handles reports functionality and user interactions
 */
export class ReportsComponent {
    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor() { }
}
