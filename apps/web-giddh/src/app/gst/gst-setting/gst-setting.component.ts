import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ReplaySubject, Observable, combineLatest } from "rxjs";
import { takeUntil, map, startWith, take } from "rxjs/operators";
import { CommonService } from "../../services/common.service";
import { StockUnitRequest } from "../../models/api-models/Inventory";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../store";
import { CustomStockUnitAction } from "../../actions/inventory/custom-stock-unit.actions";
import { Router } from "@angular/router";
import { cloneDeep } from "../../lodash-optimized";
import { ToasterService } from "../../services/toaster.service";
import { IOption } from "../../theme/ng-virtual-select/sh-options.interface";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SettingsProfileActions } from "../../actions/settings/profile/settings.profile.action";


@Component({
    selector: 'gst-setting',
    templateUrl: './gst-setting.component.html',
    styleUrls: ['./gst-setting.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GstSettingComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** this will check mobile screen size */
    public isMobileScreen: boolean = false;
    /** This will use for destroy */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds active company GST number */
    public activeCompanyGstNumber = '';
    /** List of available themes */
    public exportTypes: IOption[] = [];
    /** Holds export type */
    public exportType: string = '';
    /** Invoice Settings */
    public activeCompany: any;
    /** Holds unit array list */
    public lutListArray: any[] = [];
    /** Holds gst setting form group */
    public gstSettingForm: FormGroup;


    constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder, private store: Store<AppState>, private toasty: ToasterService, private settingsProfileActions: SettingsProfileActions, private changeDetection: ChangeDetectorRef) {
        this.store.pipe(select(appState => appState.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.activeCompanyGstNumber !== response) {
                this.activeCompanyGstNumber = response;
            }
        });
        this.store.pipe(select(state => state.session.activeCompany), take(1)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
    }

    /**
     * Lifecycle hook runs when component is initialized
     *
     * @memberof UnitMappingComponent
     */
    public ngOnInit(): void {
        this.initGstSettingForm();
        this.getLutList();
        document.querySelector('body').classList.add('gst-sidebar-open');
        document.querySelector('body').classList.add('gst-setting-page');
        this.breakpointObserver
            .observe(['(max-width: 767px)'])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((state: BreakpointState) => {
                this.isMobileScreen = state.matches;
                if (!this.isMobileScreen) {
                    this.asideGstSidebarMenuState = 'in';
                }
            });
            console.log(this.localeData);
        this.exportTypes = [
            { label: this.localeData?.with_pay, value: 'yes' },
            { label: this.localeData?.without_pay, value: 'no' }
        ];
    }

    public initGstSettingForm(): void {
        this.gstSettingForm = this.formBuilder.group({
            withPay: [false],
            formData: this.formBuilder.array([
                this.initLutForm()
            ])
        });
    }

    /**
 *This will be use for destination UntypedFormArray group
 *
 * @return {*}  {UntypedFormGroup}
 * @memberof CreateBranchTransferComponent
 */
    public initLutForm(): FormGroup {
        return this.formBuilder.group({
            fromDate: [''],
            toDate: [''],
            lutNumber: ['']
        });
    }

    /**
 * Saves export type
 *
 * @memberof OtherSettingsComponent
 */
    public setExportType(event?: any): void {
        if (event && event.value && this.exportType !== event.value) {
            this.gstSettingForm.get('withPay')?.patchValue(event.value === 'yes');
            let value = event.value === 'yes' ? true : false;
            this.store.dispatch(this.settingsProfileActions.PatchProfile({withPay:value}));
        }
    }


    /**
     * Get label for export type
     *
     * @returns {string}
     * @memberof OtherSettingsComponent
     */
    public getExportTypeLabel(): string {
        let value = this.activeCompany.withPay ? 'yes' : 'no';
        const exportType = this.exportTypes.find(item => item.value === value);
        return exportType ? exportType.label : '';
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
        document.querySelector('body').classList.remove('gst-setting-page');
        this.asideGstSidebarMenuState = 'out';
    }

    /**
     * This will use for get stock units
     *
     * @memberof UnitMappingComponent
     */
    public getLutList(): void {
        // this.commonService.getStockUnits().pipe(takeUntil(this.destroyed$)).subscribe(response => {
        //     this.units = response.body?.map((result: any) => {
        //         return {
        //             value: result.code,
        //             label: `${result.code}-${result.name}`
        //         }
        //     });
        // });
    }

}
