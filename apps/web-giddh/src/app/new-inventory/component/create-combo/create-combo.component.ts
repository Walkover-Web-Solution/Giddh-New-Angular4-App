import { Component, OnInit, ViewChildren, EventEmitter, Output } from '@angular/core';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';

@Component({
    selector: 'aside-create-combo',
    templateUrl: './create-combo.component.html',
    styleUrls: ['./create-combo.component.scss'],

})

export class CreateComboComponent implements OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
    }
    /* this will store image path*/
    public imgPath: string = '';

    @ViewChildren('unitNameType') public unitNameType: ShSelectComponent;

    public ngOnInit() {
        /* added image path */
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}
