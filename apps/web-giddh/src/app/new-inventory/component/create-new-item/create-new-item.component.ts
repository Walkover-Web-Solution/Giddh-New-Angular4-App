import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module'
import { TabsetComponent } from 'ngx-bootstrap/tabs';
@Component({
    selector: 'aside-create-new-item',
    templateUrl: './create-new-item.component.html',
    styleUrls: ['./create-new-item.component.scss'],

})

export class CreateNewItemComponent implements OnInit {
    /* this will store image path*/
    public imgPath: string = '';

    @ViewChild('staticTabs', { static: true }) public staticTabs: TabsetComponent;
    public ngOnInit() {
        /* added image path */
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}
