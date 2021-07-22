import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Account, ChildGroup } from '../../../../models/api-models/Search';
import { TRIAL_BALANCE_VIEWPORT_LIMIT } from '../../../constants/trial-balance-profit.constant';

@Component({
    selector: '[pl-grid-row]',
    templateUrl: './pl-grid-row.component.html',
    styleUrls: ['./pl-grid-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlGridRowComponent implements OnChanges {
    @Input() public groupDetail: ChildGroup;
    @Input() public search: string;
    @Input() public padding: string;
    @Input() public incomeStatement: any;
    @Input() public from: string = '';
    @Input() public to: string = '';
    /** True, if all items are expanded  */
    @Input() public expandAll: boolean;
    /** Minimum limit on which Trial balance viewport enables */
    public minimumViewportLimit = TRIAL_BALANCE_VIEWPORT_LIMIT;

    constructor(private cd: ChangeDetectorRef) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.groupDetail && !changes.groupDetail.firstChange && changes.groupDetail.currentValue !== changes.groupDetail.previousValue) {
            this.cd.detectChanges();
        }
        if (changes.search && !changes.search.firstChange && changes.search.currentValue !== changes.search.previousValue) {
            this.cd.detectChanges();
        }
    }

    public entryClicked(acc) {
        let url = location.href + '?returnUrl=ledger/' + acc.uniqueName + '/' + this.from + '/' + this.to;
        if (isElectron) {
            let ipcRenderer = (window as any).require('electron').ipcRenderer;
            url = location.origin + location.pathname + '#./pages/ledger/' + acc.uniqueName + '/' + this.from + '/' + this.to;
            console.log(ipcRenderer.send('open-url', url));
        } else if (isCordova) {
            // todo: entry Clicked in Cordova needs to be done.
        } else {
            (window as any).open(url);
        }

    }

    /**
     * Track by function for profit loss item
     *
     * @param {*} index Index of the item
     * @param {Account} item Current item
     * @return {string} Item uniquename
     * @memberof PlGridRowComponent
     */
    public trackByFn(index, item: Account): string {
        return item.uniqueName;
    }
}
