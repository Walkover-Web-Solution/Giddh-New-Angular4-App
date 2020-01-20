import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, ComponentFactoryResolver, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { AppState } from '../../../store/roots';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { CompanyResponse } from "../../../models/api-models/Company";
import { CompanyActions } from "../../../actions/company.actions";
import { CompanyAddNewUiComponent } from "../../../shared/header/components";
import { ElementViewContainerRef } from "../../../shared/helpers/directives/elementViewChild/element.viewchild.directive";
import { GroupWithAccountsAction } from "../../../actions/groupwithaccounts.actions";
import { GeneralService } from "../../../services/general.service";

@Component({
	selector: 'user-detail-company',
	styleUrls: ['./user-details-company.component.css'],
	templateUrl: './user-details-company.component.html'
})

export class UserDetailsCompanyComponent implements OnInit {

	//array holding list of companies to be displayed on UI
	private companies = [];

	//Observable for change in company list
	private companies$: Observable<CompanyResponse[]>;

	//variable storing selected company
	private selectedCmp: CompanyResponse;

	//observable for giddh spinner
	public isGetAllRequestInProcess$: Observable<boolean> = of(true);

	//Modal reference variables
	modalRef: BsModalRef;
	@ViewChild('addCompanyNewModal') public addCompanyNewModal: ModalDirective;
	@ViewChild('companynewadd') public companynewadd: ElementViewContainerRef;


	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private modalService: BsModalService, private store: Store<AppState>,
		private componentFactoryResolver: ComponentFactoryResolver, private _companyActions: CompanyActions,
		private groupWithAccountsAction: GroupWithAccountsAction, private _generalService: GeneralService) {
		this.companies$ = this.store.select(p => p.session.companies).pipe(takeUntil(this.destroyed$));
		this.isGetAllRequestInProcess$ = this.store.select(p => p.company.isCompanyActionInProgress).pipe(takeUntil(this.destroyed$));
	}

	openModal(template: TemplateRef<any>, selectedCompany: CompanyResponse) {
		this.selectedCmp = selectedCompany;
		this.modalRef = this.modalService.show(template);
	}

	confirmDelete(): void {
		this.store.dispatch(this._companyActions.DeleteCompany(this.selectedCmp.uniqueName));
		this.hideModal();
	}

	declineDelete(): void {
		this.hideModal();
	}

	hideModal() {
		this.modalRef.hide();
	}

	ngOnInit() {
		this.companies$.subscribe(a => {
			if (a) {
				this.companies = this.filterCompanyOnRole(a);
			}
		});
	}

	createNewCompany() {
		this._generalService.invokeEvent.next("resetcompanysession");
		this.showAddCompanyModal();
	}

	public showAddCompanyModal() {
		this.loadAddCompanyNewUiComponent();
		this.addCompanyNewModal.show();
	}

	public hideAddCompanyModal() {
		this.addCompanyNewModal.hide();
	}

	private filterCompanyOnRole(a: CompanyResponse[]) {
		let filteredData = a.filter((element) => element.userEntityRoles.some((subElement) => subElement.entity.entity === "COMPANY"));
		return filteredData;
	}

	public loadAddCompanyNewUiComponent() {
		let componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompanyAddNewUiComponent);
		let viewContainerRef = this.companynewadd.viewContainerRef;
		viewContainerRef.clear();
		let componentRef = viewContainerRef.createComponent(componentFactory);
		(componentRef.instance as CompanyAddNewUiComponent).closeCompanyModal.subscribe((a) => {
			this.hideAddCompanyModal();
		});
	}

}
