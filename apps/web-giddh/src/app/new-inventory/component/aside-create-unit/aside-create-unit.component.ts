import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'aside-create-unit',
    templateUrl: './aside-create-unit.component.html',
    styleUrls: ['./aside-create-unit.component.scss']
})
export class AsideCreateNewUnitComponent {
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Emits modal close event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    public closeAsidePane(event: any) {
        this.closeAsideEvent.emit(event);
    }
}
