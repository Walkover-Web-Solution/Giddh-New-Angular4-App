import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'aside-create-group',
    templateUrl: './aside-create-group.component.html',
    styleUrls: ['./aside-create-group.component.scss'],

})

export class AsideCreatGroupComponent implements OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
    }
    public ngOnInit() {

    }
}