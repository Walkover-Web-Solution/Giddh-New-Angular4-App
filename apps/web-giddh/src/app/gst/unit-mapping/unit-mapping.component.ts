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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, NgZone } from "@angular/core";
import { GeneralService } from "../../services/general.service";
import { Angular21ChangeDetectionService } from "../../services/angular21-change-detection.service";


/**
 * Handles Component functionality
 */
@Component({
    selector: 'unit-mapping',
    templateUrl: './unit-mapping.component.html',
    styleUrls: ['./unit-mapping.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
})

/**
 * UnitMappingComponent component
 * Handles unitmapping functionality and user interactions
 */
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

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private commonService: CommonService,
        private store: Store<AppState>,
        private toasty: ToasterService,
        private customStockAction: CustomStockUnitAction,
        private router: Router,
        private changeDetection: ChangeDetectorRef,
        private generalService: GeneralService,
        private ngZone: NgZone,
        private changeDetectionService: Angular21ChangeDetectionService
    ) {
        this.stockUnit$ = this.store.pipe(select(state => state.inventory.stockUnits), takeUntil(this.destroyed$));
        this.store.pipe(select(appState => appState.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
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
        /**
         * Handles combineLatest functionality
         */
        combineLatest([this.commonService.getGstUnits(), this.stockUnit$]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            /**
             * Handles if functionality
             */
            if (resp[0] && resp[1]) {
                this.unitsArray = [];
                let giddhUnits = resp[1];
                let gstUnit = resp[0]?.body;
                (Array.isArray(giddhUnits) ? giddhUnits : []).forEach((res: any) => {
                    this.unitsArray.push({ giddhUnit: res?.code, mappedGstUnit: gstUnit[res?.code], giddhUnitName: res?.name });
                });
                this.changeDetectionService.triggerChangeDetection(this.changeDetection, this.ngZone);
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
            this.changeDetectionService.triggerChangeDetection(this.changeDetection, this.ngZone);
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
            /**
             * Handles if functionality
             */
            if (response?.status === 'success') {
                this.toasty.showSnackBar("success", response?.body);
                this.changeDetectionService.triggerChangeDetection(this.changeDetection, this.ngZone);
            } else {
                this.toasty.showSnackBar("error", response?.message);
                this.changeDetectionService.safeChangeDetection(this.changeDetection, this.ngZone);
            }
        });

    }
}
