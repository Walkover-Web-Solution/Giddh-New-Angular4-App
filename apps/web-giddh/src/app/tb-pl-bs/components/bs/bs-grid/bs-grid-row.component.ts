import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChildGroup } from '../../../../models/api-models/Search';

@Component({
    selector: '[bs-grid-row]',
    templateUrl: './bs-grid-row.component.html',
    styleUrls: [`./bs-grid-row.component.scss`],
})
export class BsGridRowComponent implements OnChanges {
    @Input() public groupDetail: ChildGroup;
    @Input() public search: string;
    @Input() public padding: string;
    @Input() public from: string = '';
    @Input() public to: string = '';

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
            // todo: Entry Click need to be handeled in cordova
        } else {
            (window as any).open(url);
        }

    }
}
