import { Component, OnInit, ViewChildren } from '@angular/core';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';

@Component({
    selector: 'aside-create-combo',
    templateUrl: './create-combo.component.html',
    styleUrls: ['./create-combo.component.scss'],

})

export class CreateComboComponent implements OnInit {
    /* this will store image path*/
    public imgPath: string = '';

    @ViewChildren('unitNameType') public unitNameType: ShSelectComponent;

    public ngOnInit() {
        /* added image path */
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }
}
