import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'aside-create-unit',
    templateUrl: './aside-create-unit.component.html',
    styleUrls: ['./aside-create-unit.component.scss'],

})

export class AsideCreateNewUnitComponent implements OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
    }
    public ngOnInit() {

    }
}
