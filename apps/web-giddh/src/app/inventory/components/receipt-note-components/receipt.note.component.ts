import {Observable, of as observableOf, ReplaySubject} from 'rxjs';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {AppState} from '../../../store';
import {Store, select} from '@ngrx/store';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {
	BranchFilterRequest,
	CompanyResponse
} from '../../../models/api-models/Company';
import * as moment from 'moment/moment';
import {GeneralService} from '../../../services/general.service';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {SettingsBranchActions} from '../../../actions/settings/branch/settings.branch.action';
import {
	NewBranchTransferProduct,
	NewBranchTransferResponse,
	NewBranchTransferSourceDestination, NewBranchTransferTransportationDetails
} from '../../../models/api-models/BranchTransfer';

@Component({
	selector: 'receipt-note',
	templateUrl: './receipt.note.component.html',
	styleUrls: ['./receipt.note.component.scss'],
	animations: [
		trigger('slideInOut', [
			state('in', style({
				transform: 'translate3d(0, 0, 0)'
			})),
			state('out', style({
				transform: 'translate3d(100%, 0, 0)'
			})),
			transition('in => out', animate('400ms ease-in-out')),
			transition('out => in', animate('400ms ease-in-out'))
		]),
	]
})

export class ReceiptNoteComponent implements OnInit, OnDestroy {
	@Input() public branchTransferMode: string;

	public asideMenuState: string = 'out';
	public sendersOptions = [{
		label: 'Shalinee', value: 'Shalinee'
	}, {
		label: 'Shalinee12', value: 'Shalinee12'
	}];

	public gstinOptions = [
		{label: 'GSTIN1', value: 'GSTIN1'},
		{label: 'GSTIN2', value: 'GSTIN1'}
	];

	public selectRefDoc = [
		{label: 'Ref doc 1', vaue: 'Ref doc 1'},
		{label: 'Ref doc 2', vaue: 'Ref doc 2'}
	];

	public recGstinOptions = [
		{label: '23KSJDOS48293K', value: '23KSJDOS48293K'},
		{label: '23KSJDOS48293S', value: '23KSJDOS48293S'}
	];
	public selectRecivers = [
		{label: 'Shalinee01', value: 'Shalinee01'},
		{label: 'Shalinee02', value: 'Shalinee02'}
	];

	public hideSenderReciverDetails = false;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
	public branches$: Observable<CompanyResponse[]>;
	public branchTransfer: NewBranchTransferResponse = {
		dateOfSupply: null,
		challanNo: null,
		note: null,
		transferDate: null,
		uniqueName: null,
		source: [{
			name: null,
			uniqueName: null,
			warehouse: {
				name: null,
				uniqueName: null,
				taxNumber: null,
				address: null
			}
		}],
		destination: [{
			name: null,
			uniqueName: null,
			warehouse: {
				name: null,
				uniqueName: null,
				taxNumber: null,
				address: null
			}
		}],
		product: [{
			name: null,
			hsnNumber: null,
			sacNumber: null,
			uniqueName: null,
			stockUnit: null,
			amount: null,
			rate: null,
			quantity: null,
			description: null
		}],
		transportationDetails: {
			dispatchedDate: null,
			transporterName: null,
			transportMode: null,
			vehicleNumber: null
		},
		entity: null,
	};

	public transferType: string = 'products';

	constructor(private _router: Router, private store: Store<AppState>, private settingsBranchActions: SettingsBranchActions, private _generalService: GeneralService) {

		this.getAllBranches();

		this.store.pipe(select(s => s.settings.branches), takeUntil(this.destroyed$)).subscribe(branches => {
			if (branches) {
				if (branches.results.length) {
					this.branches$ = observableOf(_.orderBy(branches.results, 'name'));
				} else if (branches.results.length === 0) {
					this.branches$ = observableOf(null);
				}
			}
		});
	}

	public ngOnInit() {
		this.store.pipe(select(p => p.session.companyUniqueName), distinctUntilChanged()).subscribe(a => {
			if (a) {
				if (this.branchTransferMode === "receipt") {
					this.branchTransfer.source[0].uniqueName = a;
				} else {
					this.branchTransfer.destination[0].uniqueName = a;
				}
			}
		});
	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

	public closeBranchTransferPopup() {
		this._generalService.invokeEvent.next(["closebranchtransferpopup"]);
	}

	public toggleBodyClass() {
		if (this.asideMenuState === 'in') {
			document.querySelector('body').classList.add('fixed');
		} else {
			document.querySelector('body').classList.remove('fixed');
		}
	}

	public toggleAsidePane(event?): void {
		if (event) {
			event.preventDefault();
		}
		this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
		this.toggleBodyClass();
	}

	public getAllBranches() {
		let branchFilterRequest = new BranchFilterRequest();
		branchFilterRequest.from = "";
		branchFilterRequest.to = "";

		this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));
	}

	public addReceiver() {
		this.branchTransfer.destination.push({
			name: null,
			uniqueName: null,
			warehouse: {
				name: null,
				uniqueName: null,
				taxNumber: null,
				address: null
			}
		});
	}

	public addSender() {
		this.branchTransfer.source.push({
			name: null,
			uniqueName: null,
			warehouse: {
				name: null,
				uniqueName: null,
				taxNumber: null,
				address: null
			}
		});
	}

	public addProduct() {
		this.branchTransfer.product.push({
			name: null,
			hsnNumber: null,
			sacNumber: null,
			uniqueName: null,
			stockUnit: null,
			amount: null,
			rate: null,
			quantity: null,
			description: null
		});
	}

	public removeProduct(i) {
		this.branchTransfer.product.splice(i, 1);
	}

	public removeSender(i) {
		this.branchTransfer.source.splice(i, 1);
	}

	public removeReceiver(i) {
		this.branchTransfer.destination.splice(i, 1);
	}
}

