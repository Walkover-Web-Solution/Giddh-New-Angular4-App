import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../store';
import { GeneralActions } from '../../../actions/general/general.actions';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
    styleUrls: [`./purchase-record.component.scss`],
    templateUrl: './purchase-record.component.html'
})

export class PurchaseRecordComponent implements OnInit {
    public activeTab: string = 'order';
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private generalAction: GeneralActions, public route: ActivatedRoute, public router: Router) {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params['type'] && this.activeTab !== params['type']) {
                this.activeTab = params['type'];
            }
        });
    }

    /**
     * Lifecycle hook
     *
     * @memberof PurchaseRecordComponent
     */
    public ngOnInit(): void {
        this.store.dispatch(this.generalAction.setAppTitle('/pages/purchase-management/purchase'));
    }

    public onTabChanged(tabName: string): void {
        this.router.navigate(['pages/purchase-management/purchase/', tabName], { replaceUrl: true });
    }
}
