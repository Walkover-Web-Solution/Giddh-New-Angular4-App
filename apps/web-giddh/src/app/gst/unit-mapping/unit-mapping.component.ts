import { ReplaySubject, Observable, combineLatest } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CommonService } from "../../services/common.service";
import { StockUnitRequest } from "../../models/api-models/Inventory";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../store";
import { CustomStockUnitAction } from "../../actions/inventory/custom-stock-unit.actions";
import { Router } from "@angular/router";
import { cloneDeep } from "../../lodash-optimized";
import { ToasterService } from "../../services/toaster.service";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { GeneralService } from "../../services/general.service";


@Component({
    selector: 'unit-mapping',
    templateUrl: './unit-mapping.component.html',
    styleUrls: ['./unit-mapping.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class UnitMappingComponent implements OnInit, OnDestroy {
    /** This will hold the boolean value to open/close setting sidebar popup */
    public asideGstSidebarMenuState: boolean = true;
    /** This will use for destroy */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds active company GST number */
    public activeCompanyGstNumber = '';
    /** Holds units array list */
    public units: any = [];
    /** Holds stock unit observable */
    public stockUnit$: Observable<StockUnitRequest[]>;
    /** Holds unit array list */
    public unitsArray: any[] = [];
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will use for voucher api version */
    public voucherApiVersion: number;

    constructor(
        private commonService: CommonService,
        private store: Store<AppState>,
        private toasty: ToasterService,
        private customStockAction: CustomStockUnitAction,
        private router: Router,
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService
    ) {
        this.stockUnit$ = this.store.pipe(select(state => state.inventory.stockUnits), takeUntil(this.destroyed$));
        this.store.pipe(select(appState => appState.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.activeCompanyGstNumber !== response) {
                this.activeCompanyGstNumber = response;
            }
        });
    }

    /**
     * Lifecycle hook runs when component is initialized
     *
     * @memberof UnitMappingComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.getStockUnits();
        this.store.dispatch(this.customStockAction.getStockUnit());
        document.querySelector('body').classList.add('gst-sidebar-open');
        document.querySelector('body').classList.add('unit-mapping-page');
        combineLatest([this.commonService.getGstUnits(), this.stockUnit$]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            if (resp[0] && resp[1]) {
                this.unitsArray = [];
                let giddhUnits = resp[1];
                let gstUnit = resp[0]?.body;
                giddhUnits.forEach(res => {
                    this.unitsArray.push({ giddhUnit: res?.code, mappedGstUnit: gstUnit[res?.code], giddhUnitName: res?.name });
                });
                this.changeDetection.detectChanges();
            }
        });

    }

    /**
     * Lifecycle hook runs when component is destroyed
     *
     * @memberof UnitMappingComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        document.querySelector('body').classList.remove('unit-mapping-page');
        this.asideGstSidebarMenuState = false;
    }

    /**
    * Handles GST Sidebar Navigation
    *
    * @memberof UnitMappingComponent
    */
    public handleNavigation(): void {
        this.router.navigate(['pages', 'gstfiling']);
    }

    /**
     * This will use for get stock units
     *
     * @memberof UnitMappingComponent
     */
    public getStockUnits(): void {
        this.commonService.getStockUnits().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.units = response.body?.map((result: any) => {
                return {
                    value: result.code,
                    label: `${result.code}-${result.name}`
                }
            });
        });
    }

    /**
     * This will use for save mapping unit
     *
     * @memberof UnitMappingComponent
     */
    public saveMapping(): void {
        let unitsArray = cloneDeep(this.unitsArray)?.map(unit => {
            return {
                giddhUnit: unit.giddhUnit,
                mappedGstUnit: unit.mappedGstUnit || ""
            };
        });
        this.commonService.updateStockUnits(unitsArray).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                this.toasty.showSnackBar("success", response?.body);
            } else {
                this.toasty.showSnackBar("error", response?.message);
            }
        });

    }
}
