import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TemplateContentUISectionVisibility } from '../../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../../models/api-models/Invoice';
import { AppState } from 'apps/web-giddh/src/app/store';
import { SettingsProfileActions } from 'apps/web-giddh/src/app/actions/settings/profile/settings.profile.action';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';

@Component({
    selector: 'gst-template-e',
    templateUrl: './gst-template-e.component.html',
    styleUrls: ['./gst-template-e.component.scss']
})

export class GstTemplateEComponent implements OnInit, OnDestroy, OnChanges {

    @Input() public fieldsAndVisibility: any = null;
    @Input() public isPreviewMode: boolean = false;
    @Input() public showLogo: boolean = true;
    @Input() public showCompanyName: boolean;
    @Input() public companyGSTIN: string;
    @Input() public companyPAN: string;
    @Input() public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    @Input() public logoSrc: string;
    @Input() public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
    /* This will hold the value if Gst Composition will show/hide */
    @Input() public showGstComposition: boolean = false;
    @Input() public voucherType = '';
    @Input() public imageSignatureSrc: string;
    @Input() public showImageSignature: boolean;

    @Output() public sectionName: EventEmitter<string> = new EventEmitter();
    public companyAddress: string = '';
    public companySetting$: Observable<any> = observableOf(null);
    public columnsVisibled: number;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>,
        private settingsProfileActions: SettingsProfileActions) {
        this.companySetting$ = this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.companySetting$.subscribe(a => {
            if (a && a.address) {
                this.companyAddress = cloneDeep(a.address);
            } else if (!a) {
                this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if ((changes.fieldsAndVisibility && changes.fieldsAndVisibility.previousValue && changes.fieldsAndVisibility.currentValue !== changes.fieldsAndVisibility.previousValue) || changes.fieldsAndVisibility && changes.fieldsAndVisibility.firstChange) {
            this.columnsVisibled = 0;
            if (changes.fieldsAndVisibility.currentValue.table) {
                if (changes.fieldsAndVisibility.currentValue.table.sNo && changes.fieldsAndVisibility.currentValue.table.sNo?.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.item && changes.fieldsAndVisibility.currentValue.table.item?.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.hsnSac && changes.fieldsAndVisibility.currentValue.table.hsnSac?.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.quantity && changes.fieldsAndVisibility.currentValue.table.quantity?.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.rate && changes.fieldsAndVisibility.currentValue.table.rate?.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.discount && changes.fieldsAndVisibility.currentValue.table.discount?.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.taxableValue && changes.fieldsAndVisibility.currentValue.table.taxableValue?.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.taxes && changes.fieldsAndVisibility.currentValue.table.taxes?.display) {
                    this.columnsVisibled++;
                }
                if (changes.fieldsAndVisibility.currentValue.table.total && changes.fieldsAndVisibility.currentValue.table.total?.display) {
                    this.columnsVisibled++;
                }
                if (this.columnsVisibled && this.voucherType === 'sales') {
					this.columnsVisibled++;
                }
            }
        }
    }

    public onClickSection(sectionName: string) {
        if (!this.isPreviewMode) {
            this.sectionName.emit(sectionName);
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
