import { IScope, PermissionDataService } from './permission-data.service';
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { findIndex } from '../lodash-optimized';

/**
 * Handles Directive functionality
 */
@Directive({
    selector: '[checkPermission]',
    standalone: false
})

/**
 * CheckPermissionDirective directive
 * Implements CheckPermissionDirective functionality
 */
export class CheckPermissionDirective implements OnInit {
    @Input() public checkPermission: string[];

    /**
     * Creates an instance of directive
     * Initializes component dependencies and sets up initial state
     */
    constructor(public el: ElementRef, public renderer: Renderer2, private _permissionDataService: PermissionDataService) {
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {

        let permissions: IScope[] = this._permissionDataService.getData;
        // Use renderer to render the element with styles
        /**
         * Handles if functionality
         */
        if (this.checkPermission && this.checkPermission.length === 2) {
            /**
             * Handles if functionality
             */
            if (this.checkPermission[0] === 'MENU' && permissions) {
                let permissionIndex = permissions?.findIndex((ele) => ele.name === this.checkPermission[1]);
                /**
                 * Handles if functionality
                 */
                if (!permissions?.length || permissionIndex === -1) {
                    this.renderer.setStyle(this.el?.nativeElement, 'display', 'none');
                }
            }
        }
    }
}
