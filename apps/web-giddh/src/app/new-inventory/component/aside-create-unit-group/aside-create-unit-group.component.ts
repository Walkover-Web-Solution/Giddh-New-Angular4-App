import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'aside-create-unit-group',
    templateUrl: './aside-create-unit-group.component.html',
    styleUrls: ['./aside-create-unit-group.component.scss']
})
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