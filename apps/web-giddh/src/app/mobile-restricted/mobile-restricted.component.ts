import { BreakpointObserver } from "@angular/cdk/layout";
import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralService } from "../services/general.service";
import { ServiceConfig } from "../services/service.config";
import { BREAKPOINT_SCREEN_SIZE, GIDDH_ANDROID_APP_URL, GIDDH_IOS_APP_URL } from "../app.constant";
import { Configuration } from '../app.constant';
import { environment } from '../../environments/environment.generated';

@Component({
    selector: 'mobile-restricted',
standalone: false,
    templateUrl: './mobile-restricted.component.html',
    styleUrls: ['./mobile-restricted.component.scss']
})

export class MobileRestrictedComponent {
    /** Holds images folder path */
    public imgPath: string = "";
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* Hold giddh logo source */
    public giddhLogoSrc: string = '';
    /* Android app URL */
    public androidAppUrl: string = GIDDH_ANDROID_APP_URL;
    /* iOS app URL */
    public iosAppUrl: string = GIDDH_IOS_APP_URL;
    /* Check if current domain is Giddh domain */
    public isGiddhDomain: boolean = false;

    constructor(@Inject(ServiceConfig) private serviceConfig,  private breakpointObserver: BreakpointObserver, private router: Router, private generalService: GeneralService) {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.giddhLogoSrc = this.serviceConfig.LOGOS.primary;
        this.isGiddhDomain = this.serviceConfig.IS_GIDDH_DOMAIN;
        this.breakpointObserver.observe([
            BREAKPOINT_SCREEN_SIZE.UNSUPPORTED
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (!result?.breakpoints[BREAKPOINT_SCREEN_SIZE.UNSUPPORTED]) {
                this.router.navigate(['/home']);
            }
        });
    }
}
