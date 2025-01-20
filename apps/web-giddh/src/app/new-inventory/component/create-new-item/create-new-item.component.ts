import { Component, OnInit, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module'
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ServiceConfig } from '../../../services/service.config';
@Component({
    selector: 'aside-create-new-item',
    templateUrl: './create-new-item.component.html',
    styleUrls: ['./create-new-item.component.scss'],

})

export class CreateNewItemComponent implements OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* this will store hsn boolean value */
    public isHSN: boolean = true;

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
    }
    /* this will store image path*/
    public imgPath: string = '';

    @ViewChild('staticTabs', { static: true }) public staticTabs: TabsetComponent;
    constructor(@Inject(ServiceConfig) private serviceConfig ){}
    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
    }
    /* It will show/hide hsn code field */
    public selectCode(isHSN: any): void {
        this.isHSN = isHSN;
    }
}
