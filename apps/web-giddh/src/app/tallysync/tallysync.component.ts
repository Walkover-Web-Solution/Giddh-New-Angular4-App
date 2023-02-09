import { delay, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
    styleUrls: ['./tallysync.component.scss'],
    templateUrl: './tallysync.component.html'
})

export class TallysyncComponent implements OnInit, OnDestroy {
    public activeTab: string = 'inprogress';
    public showInvoiceNav: boolean = false;
    @ViewChild('staticTabs', { static: true }) public staticTabs: TabsetComponent;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};

    constructor(private activatedRoute: ActivatedRoute) {

    }

    public ngOnInit() {
        this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$), delay(700)).subscribe(a => {
            if (a.tab && a.tabIndex) {
                if (this.staticTabs && this.staticTabs.tabs) {
                    this.staticTabs.tabs[a.tabIndex].active = true;
                    this.tabChanged(a.tab);
                }
            }
        });
    }

    public pageChanged(page: string) {
        this.showInvoiceNav = ['completed', 'inprogress']?.indexOf(page) > -1;
    }

    public tabChanged(tab: string) {
        this.activeTab = tab;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
