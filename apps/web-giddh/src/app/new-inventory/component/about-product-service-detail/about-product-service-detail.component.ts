import { Component, OnInit, ViewChildren } from '@angular/core';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'about-product-service-detail',
    templateUrl: './about-product-service-detail.component.html',
    styleUrls: ['./about-product-service-detail.component.scss'],

})

export class AboutProductServiceDetailComponent implements OnInit {
    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = true;
    /* this will store image path*/
    public imgPath: string = '';
    public productContent: boolean = true;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(
        private breakPointObservar: BreakpointObserver) {

    }
    public ngOnInit() {
        /* added image path */
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        /* added break point of mobile screen size  */
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
    }
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
