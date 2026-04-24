import { BreakpointObserver } from "@angular/cdk/layout";
import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralService } from "../services/general.service";
import { ServiceConfig } from "../services/service.config";
import { BREAKPOINT_SCREEN_SIZE, Configuration } from '../app.constant';

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
    public brandLogoUrl: string = '';
    /* Android app URL */
    public androidAppUrl: string = '';
    /* iOS app URL */
    public iosAppUrl: string = '';
    /* Check if current domain is Giddh domain */
    public isGiddhDomain: boolean = false;

    constructor(@Inject(ServiceConfig) private serviceConfig,  private breakpointObserver: BreakpointObserver, private router: Router, private generalService: GeneralService) {
        this.imgPath = this.serviceConfig.IMG_PATH;
        this.brandLogoUrl = this.serviceConfig.LOGOS.dark;
        this.isGiddhDomain = this.serviceConfig.IS_GIDDH_DOMAIN;
        this.androidAppUrl = this.serviceConfig.ANDROID_APP_URL;
        this.iosAppUrl = this.serviceConfig.IOS_APP_URL;
        this.breakpointObserver.observe([
            BREAKPOINT_SCREEN_SIZE.UNSUPPORTED
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (!result?.breakpoints[BREAKPOINT_SCREEN_SIZE.UNSUPPORTED]) {
                this.router.navigate(['/home']);
            }
        });
    }
}
