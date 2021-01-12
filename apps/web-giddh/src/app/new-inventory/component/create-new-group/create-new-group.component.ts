import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module'
import { TabsModule } from 'ngx-bootstrap/tabs';
@Component({
    selector: 'aside-create-new-group',
    templateUrl: './create-new-group.component.html',
    styleUrls: ['./create-new-group.component.scss'],

})

export class CreateNewGroupComponent implements OnInit {

    /* this will store image path*/
    public imgPath: string = '';

    public ngOnInit() {
        /* added image path */
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}
