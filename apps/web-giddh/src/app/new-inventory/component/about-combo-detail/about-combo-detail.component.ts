import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'about-combo-detail',
    templateUrl: './about-combo-detail.component.html',
    styleUrls: ['./about-combo-detail.component.scss'],

})

export class AboutComboDetailComponent implements OnInit {
    /* This will store if device is mobile or not */
    public isMobileScreen: boolean = true;
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
