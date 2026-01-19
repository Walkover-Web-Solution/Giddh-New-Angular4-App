import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'dummy',
    templateUrl: './dummy.component.html',
    standalone: false
})
/**
 * DummyComponent component
 * Handles dummy functionality and user interactions
 */
export class DummyComponent implements OnInit {
    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private router: Router) { }

    /**
     * This  hook will call on component initialization
     *
     * @memberof DummyComponent
     */
    public ngOnInit(): void {
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            /**
             * Handles if functionality
             */
            if (this.router.url === '/dummy') {
                this.router.navigate(['/pages/home']);
            }
        }, 3000);
    }

}
