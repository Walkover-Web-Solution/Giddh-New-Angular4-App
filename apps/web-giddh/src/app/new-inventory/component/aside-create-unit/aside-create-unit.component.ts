import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'aside-create-unit',
    templateUrl: './aside-create-unit.component.html',
    styleUrls: ['./aside-create-unit.component.scss']
})
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
