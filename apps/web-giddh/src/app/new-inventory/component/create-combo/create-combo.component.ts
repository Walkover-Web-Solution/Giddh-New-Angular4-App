import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { ServiceConfig } from '../../../services/service.config';

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
    constructor(@Inject(ServiceConfig) private serviceConfig ){}
    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
    }
}
