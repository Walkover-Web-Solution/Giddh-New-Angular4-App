import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { ReplaySubject } from 'rxjs';
import { HSNSummary } from '../../../../../../models/api-models/GstReconcile';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'hsn-summary',
    templateUrl: './hsn-summary.component.html',
    styleUrls: ['hsn-summary.component.css'],
})
export class HsnSummaryComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public hsnSummary: HSNSummary = new HSNSummary();
    public imgPath: string = '';

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor() {
        //
    }

    public ngOnInit() {
        this.imgPath = (isElectron ||isCordova)  ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
    }

    public pageChanged(event) {
        // this.request['page'] = event.page;
        // this._store.dispatch(this.gstrAction.GetReturnSummary(this.selectedGst, this.request));
    }

    /**
     * ngOnChnages
     */
    public ngOnChanges(s: SimpleChanges) {
        //
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
