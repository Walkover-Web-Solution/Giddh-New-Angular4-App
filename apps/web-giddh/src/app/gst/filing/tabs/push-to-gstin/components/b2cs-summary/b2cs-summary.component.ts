import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { B2CSSummary } from '../../../../../../models/api-models/GstReconcile';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'b2cs-summary',
    templateUrl: './b2cs-summary.component.html',
    styleUrls: ['./b2cs-summary.component.css'],
})
export class B2csSummaryComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public brcsSummary: B2CSSummary[] = [];
    public imgPath: string = '';

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor() {
        //
    }

    public ngOnInit() {
        this.imgPath = (isElectron|| isCordova) ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
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
