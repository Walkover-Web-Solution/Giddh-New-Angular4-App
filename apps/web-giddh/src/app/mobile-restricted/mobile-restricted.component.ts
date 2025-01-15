import { BreakpointObserver } from "@angular/cdk/layout";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralService } from "../services/general.service";

@Component({
    selector: 'mobile-restricted',
    templateUrl: './mobile-restricted.component.html',
    styleUrls: ['./mobile-restricted.component.scss']
})

export class MobileRestrictedComponent {
    /** Holds images folder path */
    public imgPath: string = "";
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* Hold giddh logo source */
    public giddhLogoSrc: string = '';

    constructor(private breakpointObserver: BreakpointObserver, private router: Router, private generalService: GeneralService) {
        this.imgPath = isElectron ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
        const whiteLabel = this.generalService.getDecodedWhiteLabel();
        this.giddhLogoSrc = whiteLabel?.giddhWhiteLabel?.logo;
        this.breakpointObserver.observe([
            '(min-width: 481px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result?.matches) {
                this.router.navigate(['/home']);
            }
        });
    }
}
