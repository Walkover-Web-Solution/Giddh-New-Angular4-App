import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { DocIssueSummary, DocIssueSummaryDetailsDocs } from '../../../../../../models/api-models/GstReconcile';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { environment } from 'apps/web-giddh/src/environments/environment.generated';
import { Configuration } from 'apps/web-giddh/src/app/app.constant';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'document-issued',
    templateUrl: './document-issued.component.html',
    styleUrls: ['./document-issued.component.css'],
    standalone: false
})
export class DocumentIssuedComponent implements OnInit, OnChanges, OnDestroy {
    // tslint:disable:variable-name
    @Input() public doc_issues: DocIssueSummary = new DocIssueSummary();
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    public doc_issuesVM: DocIssueSummaryDetailsDocs[] = [];
    public imgPath: string = '';

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(@Inject(ServiceConfig) private serviceConfig ) {

    }

    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : environment.AppUrl + environment.APP_FOLDER + 'assets/images/gst/';
    }

    /**
     * ngOnChnages
     */
    public ngOnChanges(s: SimpleChanges) {
        if (s['doc_issues']?.currentValue && s['doc_issues']?.currentValue !== s['doc_issues']?.previousValue) {
            (Array.isArray(this.doc_issues.doc_det) ? this.doc_issues.doc_det : []).forEach(f => {
                this.doc_issuesVM.push(...f.docs);
            });
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
