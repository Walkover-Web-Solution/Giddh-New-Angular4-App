import { Component, OnInit, ViewChildren, EventEmitter, Output } from '@angular/core';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';

@Component({
    selector: 'aside-create-new-unit',
    templateUrl: './create-unit.component.html',
    styleUrls: ['./create-unit.component.scss'],

})

export class CreateNewUnitComponent implements OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
    }

    @ViewChildren('unitNameType') public unitNameType: ShSelectComponent;
    public isDivide: boolean = false;
    public changeType(ev) {
        this.isDivide = ev;
    }
    public ngOnInit() {

    }
}
