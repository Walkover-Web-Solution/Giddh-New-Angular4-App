import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'aside-create-unit-group',
    
    templateUrl: './aside-create-unit-group.component.html',
    standalone: false,
    styleUrls: ['./aside-create-unit-group.component.scss']
})
/**
 * AsideCreateUnitGroupComponent component
 * Handles asidecreateunitgroup functionality and user interactions
 */
export class AsideCreateUnitGroupComponent {
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Emits modal close event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    /**
     * Closes aside pane
     *
     * @param {*} event
     * @memberof AsideCreateUnitGroupComponent
     */
    public closeAsidePane(event: any) {
        this.closeAsideEvent.emit(event);
    }
}