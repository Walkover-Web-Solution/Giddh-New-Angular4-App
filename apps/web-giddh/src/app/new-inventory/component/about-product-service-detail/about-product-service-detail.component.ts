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

    public productContent: boolean = true;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(
        private _breakPointObservar: BreakpointObserver,) {

    }

    public ngOnInit() {
        /* added break point of mobile screen size  */
        this._breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

    }
}
