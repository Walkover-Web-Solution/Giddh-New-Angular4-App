import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'aside-create-unit',
    
    templateUrl: './aside-create-unit.component.html',
    standalone: false,
    styleUrls: ['./aside-create-unit.component.scss']
})
/**
 * AsideCreateNewUnitComponent component
 * Handles asidecreatenewunit functionality and user interactions
 */
export class AsideCreateNewUnitComponent {
    /** Holds unit group details */
    @Input() public unitGroupDetails: any = {};
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
     * @memberof AsideCreateNewUnitComponent
     */
    public closeAsidePane(event: any) {
        this.closeAsideEvent.emit(event);
    }
}
