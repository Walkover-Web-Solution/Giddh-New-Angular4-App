import { forEach } from 'apps/web-giddh/src/app/lodash-optimized';
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
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
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { SettingsProfileActions } from "../../actions/settings/profile/settings.profile.action";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { GeneralService } from "../../services/general.service";
import { GIDDH_DATE_RANGE_PICKER_RANGES } from "../../app.constant";
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_YYYY_MM_DD, GIDDH_NEW_DATE_FORMAT_UI } from "../../shared/helpers/defaultDateFormat";
import * as dayjs from "dayjs";
import { GstSettingComponentStore } from "./utility/gst-setting.store";


@Component({
    selector: 'gst-setting',
    templateUrl: './gst-setting.component.html',
    styleUrls: ['./gst-setting.component.scss'],
    providers: [GstSettingComponentStore],
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
    /** List of available themes */
    public exportTypes: IOption[] = [];
    /** Holds export type */
    public exportType: string = '';
    /** Invoice Settings */
    public activeCompany: any;
    /** Holds gst setting form group */
    public gstSettingForm: FormGroup;
    /** Entry index which is open in edit mode */
    public activeEntryIndex: number = null;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /** Get Lut Number get in progress Observable */
    public isLoading$: Observable<any> = this.componentStore.isLoading$;
    /** Delete Lut Number in progress Observable */
    public deleteLutNumberIsSuccess$: Observable<any> = this.componentStore.deleteLutNumberIsSuccess$;
    /** Create Lut Number in progress Observable */
    public createUpdateInSuccess$: Observable<any> = this.componentStore.createUpdateInSuccess$;
    public responseArray: any[] = [];
    public lutItemList: any[] = [];

    constructor(
        private breakpointObserver: BreakpointObserver,
        private formBuilder: FormBuilder,
        private store: Store<AppState>,
        private toasty: ToasterService,
        private settingsProfileActions: SettingsProfileActions,
        private changeDetection: ChangeDetectorRef,
        private componentStore: GstSettingComponentStore
    ) {
        this.componentStore.getLutNumberList();
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
    }

    /**
     * Lifecycle hook runs when component is initialized
     *
     * @memberof GstSettingComponent
     */
    public ngOnInit(): void {
        this.initGstSettingForm();
        this.getLutList();
        document.querySelector('body').classList.add('gst-sidebar-open');
        document.querySelector('body').classList.add('gst-setting-page');
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.fromDate = universalDate[0];
                this.toDate = universalDate[1];
                let gstFormArray = this.gstSettingForm.get('gstData') as FormArray;
                let gstFormGroup = gstFormArray?.at(0);
                gstFormGroup?.get('fromDate')?.patchValue(this.fromDate);
                gstFormGroup?.get('toDate')?.patchValue(this.toDate);
            }
        });
        this.breakpointObserver
            .observe(['(max-width: 767px)'])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((state: BreakpointState) => {
                this.isMobileScreen = state.matches;
                if (!this.isMobileScreen) {
                    this.asideGstSidebarMenuState = 'in';
                }
            });

        this.deleteLutNumberIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result) {
                this.getLutList();
            }
        });

        this.componentStore.lutNumberList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.length) {
                let mappings = this.gstSettingForm.get('gstData') as FormArray;
                mappings.clear();
                this.lutItemList = response;
                response.forEach((item) => {
                    this.addNewLutItem(item);
                })
            }
        });

        this.componentStore.lutNumberResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.responseArray[response.lutIndex] = response;
                this.changeDetection.detectChanges();
            }
        });
    }

    public initGstSettingForm(): void {
        this.gstSettingForm = this.formBuilder.group({
            withPay: [false],
            gstData: this.formBuilder.array([
                this.initLutForm()
            ])
        });
    }

    /**
 *This will be use for destination UntypedFormArray group
 *
 * @return {*}  {FormGroup}
 * @memberof GstSettingComponent
 */
    public initLutForm(data?: any): FormGroup {
        return this.formBuilder.group({
            fromDate: [data?.fromDate ?? ''],
            toDate: [data?.toDate ?? ''],
            lutNumber: [data?.lutNumber ?? ''],
            uniqueName: [data?.uniqueName ?? '']
        });
    }

    /**
     * Get label for export type
     *
     * @returns {string}
     * @memberof GstSettingComponent
     */
    public getExportTypeLabel(): string {
        let value = this.activeCompany.withPay ? 'yes' : 'no';
        const exportType = this.exportTypes.find(item => item.value === value);
        return exportType ? exportType.label : '';
    }

    /**
 * Saves export type
 *
 * @memberof GstSettingComponent
 */
    public setExportType(event?: any): void {
        if (event && event.value && this.exportType !== event.value) {
            this.gstSettingForm.get('withPay')?.patchValue(event.value === 'yes');
            let value = event.value === 'yes' ? true : false;
            this.store.dispatch(this.settingsProfileActions.PatchProfile({ withPay: value }));
        }
    }

    /**
 * This will use for get stock units
 *
 * @memberof GstSettingComponent
 */
    public getLutList(): void {
        this.componentStore.getLutNumberList();
    }


    /**
     * This will be use for add new lut item
     *
     * @param {*} [user]
     * @memberof OtherSettingsComponent
     */
    public addNewLutItem(user?: any): void {
        let mappings = this.gstSettingForm.get('gstData') as FormArray;
        if (user) {
            mappings.push(this.initLutForm({
                fromDate: this.fromDate,
                toDate: this.toDate
            }));
            let lastIndex = mappings.controls.findIndex(control => !control.get('lutNumber')?.value);
            let lastFormArray = mappings.at(lastIndex);
            let fromDate = null;
            let toDate = null;
            if (user.fromDate && user.toDate) {
                fromDate = dayjs(user?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD);
                toDate = dayjs(user.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD);
            }
            if (!lastFormArray?.get('lutNumber')?.value) {
                mappings.at(lastIndex).patchValue({
                    fromDate: fromDate,
                    toDate: toDate,
                    lutNumber: user.lutNumber,
                    uniqueName: user.uniqueName
                });
            }
        } else {
            mappings.push(this.initLutForm({
                fromDate: this.fromDate,
                toDate: this.toDate
            }));
        }
    }


    /**
 * This will be use for remove lut item
 *
 * @param {number} index
 * @memberof OtherSettingsComponent
 */
    public removeLutItem(index: number): void {
        let mappings = this.gstSettingForm.get('gstData') as FormArray;
        let mappingForm = mappings.at(index);
        if (index === 0) {
            if (mappingForm.get('uniqueName')?.value) {
                this.componentStore.deleteLutNumber({ lutNumberUniqueName: mappingForm.get('uniqueName')?.value });
                mappings.removeAt(index);
                mappings.push(this.initLutForm({
                    fromDate: this.fromDate,
                    toDate: this.toDate
                }));
            } else {
                mappingForm.get('lutNumber')?.patchValue(null);
                mappingForm.get('fromDate')?.patchValue(this.fromDate);
                mappingForm.get('toDate')?.patchValue(this.toDate);
            }
        } else {
            mappings.removeAt(index);
            if (mappingForm.get('uniqueName')?.value) {
                this.componentStore.deleteLutNumber({ lutNumberUniqueName: mappingForm.get('uniqueName')?.value });
            }
        }
    }

    /**
 * Callback for translation response complete
 *
 * @param {*} event
 * @memberof OtherSettingsComponent
 */
    public translationComplete(event: any): void {
        if (event) {
            this.exportTypes = [
                { label: this.localeData?.with_pay, value: 'yes' },
                { label: this.localeData?.without_pay, value: 'no' }
            ];
            this.changeDetection.detectChanges();
        }
    }


    public saveLutNumbers(): void {
        this.responseArray = [];
        const items = this.gstSettingForm.get('gstData') as FormArray;

        // Map controls to include original indices
        const itemsWithOriginalIndex = items.controls.map((ctrl, i) => ({
            ...ctrl.value,
            fromDate: dayjs(ctrl.value.fromDate).format(GIDDH_DATE_FORMAT),
            toDate: dayjs(ctrl.value.toDate).format(GIDDH_DATE_FORMAT)
        }));

        itemsWithOriginalIndex.forEach((obj1, index) => {
            if (!this.lutItemList[index] || this.lutItemList[index].fromDate !== obj1.fromDate || this.lutItemList[index].lutNumber !== obj1.lutNumber || this.lutItemList[index].toDate !== obj1.toDate) {
                console.log(this.lutItemList[index]);
                if (!this.lutItemList[index]) {
                    const req = {
                        q: obj1,
                        index: index,
                        autoSelectLutNumber: true
                    };
                    this.componentStore.createLutNumber(req);
                } else {
                    const req = {
                        q: obj1,
                        index: index,
                        autoSelectLutNumber: true,
                        uniqueName: obj1.uniqueName
                    };
                    this.componentStore.updateLutNumber(req);
                }
            }
        });
        // console.log(this.lutItemList, itemsWithOriginalIndex);
        // this.lutItemList.forEach((obj1, index) => {
        //     const obj2 = itemsWithOriginalIndex.find(item => item.lutNumber === obj1.lutNumber);
        //     console.log(obj1,obj2, index);
        //     let createObj;
        //     let updateObj;
        //     if (obj2) {
        //         if (obj1.lutNumber === obj2.lutNumber && obj1.fromDate === obj2.fromDate && obj1.toDate === obj2.toDate) {

        //         }
        //     } else {
        //         console.log(`No matching object found in list2 for obj1 at index ${index}:`, obj1);
        //     }
        // });
    }


    /**
    * Lifecycle hook runs when component is destroyed
    *
    * @memberof GstSettingComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        document.querySelector('body').classList.remove('gst-setting-page');
        this.asideGstSidebarMenuState = 'out';
    }



}
