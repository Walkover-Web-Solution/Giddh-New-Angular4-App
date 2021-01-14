import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module'
import { TabsModule } from 'ngx-bootstrap/tabs';
@Component({
    selector: 'aside-create-new-group',
    templateUrl: './create-new-group.component.html',
    styleUrls: ['./create-new-group.component.scss'],

})

export class CreateNewGroupComponent implements OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* store create group value */
    public createGroupaside:boolean = true;
    /*stor value of hide create field data*/
    public hideCreateFieldData:boolean = true;

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
    }
    /* this will store image path*/
    public imgPath: string = '';

    public ngOnInit() {
        /* added image path */
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}
