import { Component, Inject } from '@angular/core';
import { GeneralService } from '../services/general.service';
import { ServiceConfig } from '../services/service.config';

@Component({
  standalone: false,
    styleUrls: ['./app-login-success.scss'],
    templateUrl: './app-login-success.html'
})
export class AppLoginSuccessComponent {
    /* Hold image path */
    public imgPath: string = '';
    /* Hold logo source */
    public giddhLogoSrc: string = '';
    constructor(private generalService: GeneralService, @Inject(ServiceConfig) private serviceConfig) {
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
        const whiteLabel = this.generalService.getDecodedWhiteLabel();
        this.giddhLogoSrc = whiteLabel?.giddhWhiteLabel?.logo || this.imgPath + 'giddh-big-logo.svg';
    }
}
