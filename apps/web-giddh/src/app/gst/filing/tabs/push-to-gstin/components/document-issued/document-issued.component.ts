import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { DocIssueSummary, DocIssueSummaryDetailsDocs } from '../../../../../../models/api-models/GstReconcile';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { environment } from 'apps/web-giddh/src/environments/environment.generated';
import { Configuration } from 'apps/web-giddh/src/app/app.constant';

/**
 * Handles Component functionality
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'document-issued',
    templateUrl: './document-issued.component.html',
    styleUrls: ['./document-issued.component.css'],
    standalone: false
})
/**
 * DocumentIssuedComponent component
 * Handles documentissued functionality and user interactions
 */
export class DocumentIssuedComponent implements OnInit, OnChanges, OnDestroy {
    // tslint:disable:variable-name
    @Input() public doc_issues: DocIssueSummary = new DocIssueSummary();
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    public doc_issuesVM: DocIssueSummaryDetailsDocs[] = [];
    public imgPath: string = '';

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(@Inject(ServiceConfig) private serviceConfig ) {

    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
    }

    /**
     * ngOnChnages
     */
    public ngOnChanges(s: SimpleChanges) {
        /**
         * Handles if functionality
         */
        if (s['doc_issues']?.currentValue && s['doc_issues']?.currentValue !== s['doc_issues']?.previousValue) {
            (Array.isArray(this.doc_issues.doc_det) ? this.doc_issues.doc_det : []).forEach(f => {
                this.doc_issuesVM.push(...f.docs);
            });
        }
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
