import { Component, Inject } from '@angular/core';
import { ServiceConfig } from '../services/service.config';
import { Configuration } from '../app.constant';
import { environment } from '../../environments/environment.generated';

@Component({
    selector: 'app-login-success',
  standalone: false,
    styleUrls: ['./app-login-success.scss'],
    templateUrl: './app-login-success.html'
})
export class AppLoginSuccessComponent {
    /* Hold logo source */
    public brandLogoUrl: string = '';
    constructor(@Inject(ServiceConfig) private serviceConfig) {
        this.brandLogoUrl = this.serviceConfig.LOGOS.dark;
    }
}
