import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingsProfileActions } from '../../../../../../actions/settings/profile/settings.profile.action';
import { CustomTemplateResponse } from '../../../../../../models/api-models/Invoice';
import { TemplateContentUISectionVisibility } from '../../../../../../services/invoice.ui.data.service';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_DD_MM_YYYY } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';

@Component({
    selector: 'tally-template',
    templateUrl: './tally-template.component.html',
    styleUrls: ['./tally-template.component.scss']
})

export class TallyTemplateComponent implements OnInit, OnDestroy {
    /** Holds fields and visibility object */
    @Input() public fieldsAndVisibility: any = null;
    /** Holds true if preview mode */
    @Input() public isPreviewMode: boolean = false;
    /** Holds true to show company logo */
    @Input() public showLogo: boolean = true;
    /** Holds true if show company name */
    @Input() public showCompanyName: boolean;
    /** Holds company GSTIN  number as string */
    @Input() public companyGSTIN: string;
    /** Holds true if company PAN number as string */
    @Input() public companyPAN: string;
    /** Holds template input data */
    @Input() public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    /** Holds uploaded company logo source */
    @Input() public logoSrc: string;
    /** Holds uploaded image signature source */
    @Input() public imageSignatureSrc: string;
    /** Holds true show image signature */
    @Input() public showImageSignature: boolean;
    /* This will hold active company*/
    @Input() public activeCompany: any;
    /** Holds template UI Section Visibility  status and label name */
    @Input() public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
    /* This will hold the value if Gst Composition will show/hide */
    @Input() public showGstComposition: boolean = false;
    /** Holds voucher type */
    @Input() public voucherType: string;
    /** Emits selected section name to edit and show respective options */
    @Output() public sectionName: EventEmitter<string> = new EventEmitter();
    /** Holds company setting */
    public companySetting$: Observable<any> = observableOf(null);
    /** Holds company address */
    public companyAddress: string = '';
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds dollar symbol */
    public dollarSymbol = '$';
    /** Holds true if company Base Currency is Rupee */
    public isBaseCurrencyRupee = true;
    /** Holds rupee symbol */
    public rupeeSymbol = '&#8377';
    /** Holds images folder path */
    public imgPath: string = "";

    constructor(
        private store: Store<AppState>,
        @Inject(ServiceConfig) private serviceConfig,
        private settingsProfileActions: SettingsProfileActions
    ) {
        this.companySetting$ = this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     *
     * @memberof TallyTemplateAComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
        this.companySetting$.subscribe(address => {
            if (address && address.address) {
                this.companyAddress = cloneDeep(address.address);
            } else if (!address) {
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
            }
        });
    }

    /**
     * Current date in different format
     *
     * @param {boolean} [isDefaultGiddhDate=true]
     * @param {boolean} [dateInNumber=false]
     * @return {*}  {string}
     * @memberof TallyTemplateAComponent
     */
    public getTodayDate(isDefaultGiddhDate: boolean = true, dateInNumber: boolean = false): string {
        return dayjs().format(dateInNumber ? "DDMMYYYY" : (isDefaultGiddhDate ? GIDDH_DATE_FORMAT : GIDDH_DATE_FORMAT_DD_MM_YYYY));
    }

    /**
     * Handle template edit section click
     *
     * @param {string} sectionName
     * @memberof TallyTemplateAComponent
     */
    public onClickSection(sectionName: string): void {
        if (!this.isPreviewMode) {
            this.sectionName.emit(sectionName);
        }
    }

    /**
     * Life cycle hook runs when the component is destroyed
     *
     * @memberof TallyTemplateAComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
