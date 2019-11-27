import {Observable, of as observableOf, ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AppState} from '../../../store';
import {Store, select} from '@ngrx/store';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {
	CompanyResponse
} from '../../../models/api-models/Company';
import * as moment from 'moment/moment';
import {GeneralService} from '../../../services/general.service';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {SettingsBranchActions} from '../../../actions/settings/branch/settings.branch.action';
import {
	ILinkedStocksResult,
	LinkedStocksResponse, LinkedStocksVM,
	NewBranchTransferProduct,
	NewBranchTransferResponse,
	NewBranchTransferSourceDestination, NewBranchTransferTransportationDetails
} from '../../../models/api-models/BranchTransfer';
import {InventoryAction} from "../../../actions/inventory/inventory.actions";
import {OnboardingFormRequest} from "../../../models/api-models/Common";
import {CommonActions} from "../../../actions/common.actions";
import {IOption} from "../../../theme/ng-select/option.interface";

@Component({
	selector: 'new-branch-transfer',
	templateUrl: './new.branch.transfer.component.html',
	styleUrls: ['./new.branch.transfer.component.scss'],
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

export class NewBranchTransferComponent implements OnInit, OnDestroy {
	@Input() public branchTransferMode: string;

	public asideMenuState: string = 'out';

	public gstinOptions = [
		{label: 'GSTIN1', value: 'GSTIN1'},
		{label: 'GSTIN2', value: 'GSTIN1'}
	];

	public hideSenderReciverDetails = false;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
	public branchTransfer: NewBranchTransferResponse = {
		dateOfSupply: null,
		challanNo: null,
		note: null,
		uniqueName: null,
		source: [{
			name: null,
			uniqueName: null,
			warehouse: {
				name: null,
				uniqueName: null,
				taxNumber: null,
				address: null,
				stockDetails: {
					stockUnit: null,
					amount: null,
					rate: null,
					quantity: null
				}
			}
		}],
		destination: [{
			name: null,
			uniqueName: null,
			warehouse: {
				name: null,
				uniqueName: null,
				taxNumber: null,
				address: null,
				stockDetails: {
					stockUnit: null,
					amount: null,
					rate: null,
					quantity: null
				}
			}
		}],
		product: [{
			name: null,
			hsnNumber: null,
			sacNumber: null,
			uniqueName: null,
			stockDetails: {
				stockUnit: null,
				amount: null,
				rate: null,
				quantity: null
			},
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
	public branches: any;
	public branches$: Observable<CompanyResponse[]>;
	public warehouses: IOption[] = [];
	public formFields: any[] = [];
	public stockList: IOption[] = [];
	public newProduct: NewBranchTransferProduct = new NewBranchTransferProduct();

	constructor(private _router: Router, private store: Store<AppState>, private settingsBranchActions: SettingsBranchActions, private _generalService: GeneralService, private _inventoryAction: InventoryAction, private commonActions: CommonActions, private inventoryAction: InventoryAction) {
		this.store.dispatch(this.inventoryAction.GetStock());

		this.store.pipe(select(p => p.inventory.stocksList), takeUntil(this.destroyed$)).subscribe((o) => {
			if (o && !_.isEmpty(o)) {
				this.stockList = [];
				let stockList = _.cloneDeep(o);

				stockList.results.forEach(key => {
					this.stockList.push({label: key.name, value: key.uniqueName, additional: key});
				});
			}
		});

		this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$)).subscribe((o) => {
			if (o && !_.isEmpty(o)) {
				let companyInfo = _.cloneDeep(o);
				this.getOnboardingForm(companyInfo.countryV2.alpha2CountryCode);
			}
		});

		this.getBranches();
	}

	public ngOnInit() {

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

	public addReceiver() {
		this.branchTransfer.destination.push({
			name: null,
			uniqueName: null,
			warehouse: {
				name: null,
				uniqueName: null,
				taxNumber: null,
				address: null,
				stockDetails: {
					stockUnit: null,
					amount: null,
					rate: null,
					quantity: null
				}
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
				address: null,
				stockDetails: {
					stockUnit: null,
					amount: null,
					rate: null,
					quantity: null
				}
			}
		});
	}

	public addProduct() {
		this.branchTransfer.product.push({
			name: null,
			hsnNumber: null,
			sacNumber: null,
			uniqueName: null,
			stockDetails: {
				stockUnit: null,
				amount: null,
				rate: null,
				quantity: null
			},
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

	public linkedStocksVM(data: ILinkedStocksResult[]): LinkedStocksVM[] {
		let branches: LinkedStocksVM[] = [];
		this.warehouses = [];
		data.forEach(d => {
			branches.push(new LinkedStocksVM(d.name, d.uniqueName));
			if (d.warehouses.length) {
				this.warehouses[d.uniqueName] = [];

				d.warehouses.forEach(key => {
					this.warehouses[d.uniqueName].push({label: key.name, value: key.uniqueName});
				});
			}
		});
		return branches;
	}

	public getOnboardingForm(countryCode) {
		this.store.dispatch(this.commonActions.resetOnboardingForm());

		this.store.pipe(select(s => s.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
			if (res) {
				Object.keys(res.fields).forEach(key => {
					this.formFields[res.fields[key].name] = [];
					this.formFields[res.fields[key].name] = res.fields[key];
				});
			} else {
				let onboardingFormRequest = new OnboardingFormRequest();
				onboardingFormRequest.formName = '';
				onboardingFormRequest.country = countryCode;
				this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));
			}
		});
	}

	public getBranches() {
		this.store.dispatch(this._inventoryAction.GetAllLinkedStocks());

		this.store.pipe(select(s => s.inventoryBranchTransfer.linkedStocks), takeUntil(this.destroyed$)).subscribe((branches: LinkedStocksResponse) => {
			if (branches) {
				if (branches.results.length) {
					this.branches = this.linkedStocksVM(branches.results).map(b => ({
						label: b.name,
						value: b.uniqueName,
						additional: b
					}));
					this.branches$ = observableOf(this.branches);
				} else {
					this.branches$ = observableOf(null);
				}
			}
		});
	}

	public selectProduct(event, product) {
		if (event) {
			product.stockDetails.rate = event.additional.rate;
			product.stockDetails.amount = event.additional.amount;
			product.stockDetails.quantity = event.additional.openingQuantity;
		}
	}

	public submit() {
		console.log(this.branchTransfer);
	}
}