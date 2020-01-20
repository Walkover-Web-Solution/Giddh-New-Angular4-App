import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppState } from '../../../../store/roots';
import { ReplaySubject } from 'rxjs';
import { InvoiceActions } from '../../../../actions/invoice/invoice.actions';
import { InvoiceTemplatesService } from '../../../../services/invoice.templates.service';
import { InvoiceUiDataService } from '../../../../services/invoice.ui.data.service';
import { TemplateContentUISectionVisibility } from '../../../../../../services/invoice.ui.data.service';
import { CustomTemplateResponse } from '../../../../../../models/api-models/Invoice';

@Component({
	selector: 'gst-template-c',
	templateUrl: './gst-template-c.component.html',
	styleUrls: ['./gst-template-c.component.css'],
	// encapsulation: ViewEncapsulation.None
})

export class GstTemplateCComponent implements OnInit, OnDestroy, OnChanges {

	@Input() public fieldsAndVisibility: any = null;
	@Input() public isPreviewMode: boolean = false;
	@Input() public showLogo: boolean = true;
	@Input() public showCompanyName: boolean;
	@Input() public companyGSTIN: string;
	@Input() public companyPAN: string;
	@Input() public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
	@Input() public logoSrc: string;
	@Input() public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();

	@Input() public voucherType = '';

	@Input() public imageSignatureSrc: string;
	@Input() public showImageSignature: boolean;

	@Output() public sectionName: EventEmitter<string> = new EventEmitter();
	public columnsVisibled: number;

	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor() {
		//
	}

	public ngOnInit() {
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
				// if (changes.fieldsAndVisibility.currentValue.table.sNo && changes.fieldsAndVisibility.currentValue.table.sNo.display) {
				//   this.columnsVisibled++;
				// }
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
				if (changes.fieldsAndVisibility.currentValue.table.discount && changes.fieldsAndVisibility.currentValue.table.discount.display) {
					this.columnsVisibled++;
				}
				if (changes.fieldsAndVisibility.currentValue.table.taxableValue && changes.fieldsAndVisibility.currentValue.table.taxableValue.display) {
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
