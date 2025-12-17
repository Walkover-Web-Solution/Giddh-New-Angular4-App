import { BreakpointObserver } from "@angular/cdk/layout";
import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralService } from "../services/general.service";
import { ServiceConfig } from "../services/service.config";
import { BREAKPOINT_SCREEN_SIZE } from "../app.constant";
import { Configuration } from '../app.constant';
import { environment } from '../../environments/environment';

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

    constructor(@Inject(ServiceConfig) private serviceConfig,  private breakpointObserver: BreakpointObserver, private router: Router, private generalService: GeneralService) {
        this.imgPath = Configuration.isElectron ? "assets/images/" : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + "assets/images/";
        const whiteLabel = this.generalService.getDecodedWhiteLabel();
        this.giddhLogoSrc = whiteLabel?.giddhWhiteLabel?.logo || this.imgPath + 'giddh-text-primary-logo.svg';
        this.breakpointObserver.observe([
            BREAKPOINT_SCREEN_SIZE.UNSUPPORTED
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (!result?.breakpoints[BREAKPOINT_SCREEN_SIZE.UNSUPPORTED]) {
                this.router.navigate(['/home']);
            }
        });
    }
}
