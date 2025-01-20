import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { DocIssueSummary, DocIssueSummaryDetailsDocs } from '../../../../../../models/api-models/GstReconcile';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'document-issued',
    templateUrl: './document-issued.component.html',
    styleUrls: ['./document-issued.component.css'],
})
export class DocumentIssuedComponent implements OnInit, OnChanges, OnDestroy {
    // tslint:disable:variable-name
    @Input() public doc_issues: DocIssueSummary = new DocIssueSummary();
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    public doc_issuesVM: DocIssueSummaryDetailsDocs[] = [];
    public imgPath: string = '';

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor() {

    }

    public ngOnInit() {
        this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
    }

    /**
     * ngOnChnages
     */
    public ngOnChanges(s: SimpleChanges) {
        if (s['doc_issues']?.currentValue && s['doc_issues']?.currentValue !== s['doc_issues']?.previousValue) {
            this.doc_issues.doc_det.forEach(f => {
                this.doc_issuesVM.push(...f.docs);
            });
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
