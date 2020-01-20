import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { from, Observable, ReplaySubject } from 'rxjs';
import { InvoiceActions } from '../../../../actions/invoice/invoice.actions';
import * as _ from 'lodash';
import { InvoiceTemplatesService } from '../../../../services/invoice.templates.service';
import { InvoiceUiDataService } from '../../../../services/invoice.ui.data.service';
import { TemplateContentUISectionVisibility } from '../../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../../models/api-models/Invoice';
import { SettingsProfileActions } from 'apps/web-giddh/src/app/actions/settings/profile/settings.profile.action';
import { AppState } from 'apps/web-giddh/src/app/store';

@Component({
	selector: 'gst-template-b',
	templateUrl: './gst-template-b.component.html',
	styleUrls: ['./gst-template-b.component.css'],
	// encapsulation: ViewEncapsulation.None
})

export class GstTemplateBComponent implements OnInit, OnDestroy, OnChanges {
	@Input() public fieldsAndVisibility: any = null;
	@Input() public isPreviewMode: boolean = false;
	@Input() public showLogo: boolean = true;
	@Input() public showCompanyName: boolean;
	@Input() public companyGSTIN: string;
	@Input() public companyPAN: string;
	@Input() public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
	@Input() public logoSrc: string;
	@Input() public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();

	@Input() public imageSignatureSrc: string;
	@Input() public showImageSignature: boolean;

	@Input() public voucherType = '';

	@Output() public sectionName: EventEmitter<string> = new EventEmitter();
	public companySetting$: Observable<any> = from([]);
	public companyAddress: string = '';
	public columnsVisibled: number;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private store: Store<AppState>,
		private settingsProfileActions: SettingsProfileActions) {
		this.companySetting$ = this.store.select(s => s.settings.profile).pipe(takeUntil(this.destroyed$));
		//
	}

	public ngOnInit() {

		this.companySetting$.subscribe(a => {
			if (a && a.address) {
				this.companyAddress = _.cloneDeep(a.address);
			} else if (!a) {
				this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
			}
		});
		//
	}

	public onClickSection(sectionName: string) {
		if (!this.isPreviewMode) {
			this.sectionName.emit(sectionName);
		}
	}

	/**
	 * ngOnChanges
	 */
	public ngOnChanges(changes: SimpleChanges) {

		if ((changes.fieldsAndVisibility && changes.fieldsAndVisibility.previousValue && changes.fieldsAndVisibility.currentValue !== changes.fieldsAndVisibility.previousValue) || changes.fieldsAndVisibility && changes.fieldsAndVisibility.firstChange) {
			this.columnsVisibled = 0;
			if (changes.fieldsAndVisibility.currentValue.table) {
				if (changes.fieldsAndVisibility.currentValue.table.sNo && changes.fieldsAndVisibility.currentValue.table.sNo.display) {
					this.columnsVisibled++;
				}
				if (changes.fieldsAndVisibility.currentValue.table.date && changes.fieldsAndVisibility.currentValue.table.date.display) {
					this.columnsVisibled++;
				}
				if (changes.fieldsAndVisibility.currentValue.table.item && changes.fieldsAndVisibility.currentValue.table.item.display) {
					this.columnsVisibled++;
				}
				if (changes.fieldsAndVisibility.currentValue.table.hsnSac && changes.fieldsAndVisibility.currentValue.table.hsnSac.display) {
					this.columnsVisibled++;
				}
				if (changes.fieldsAndVisibility.currentValue.table.quantity && changes.fieldsAndVisibility.currentValue.table.quantity.display) {
					this.columnsVisibled++;
				}
				if (changes.fieldsAndVisibility.currentValue.table.rate && changes.fieldsAndVisibility.currentValue.table.rate.display) {
					this.columnsVisibled++;
				}
				if (changes.fieldsAndVisibility.currentValue.table.taxes && changes.fieldsAndVisibility.currentValue.table.taxes.display) {
					this.columnsVisibled++;
				}
				if (changes.fieldsAndVisibility.currentValue.table.total && changes.fieldsAndVisibility.currentValue.table.total.display) {
					this.columnsVisibled++;
				}
			}
		}

	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
