import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Configuration } from '../../../../app.constant';
import { IForceClear } from '../../../../models/api-models/Sales';
import { IGroupsWithStocksHierarchyMinItem } from '../../../../models/interfaces/groupsWithStocks.interface';
import { LEDGER_API } from '../../../../services/apiurls/ledger.api';
import { InventoryService } from '../../../../services/inventory.service';
import { ToasterService } from '../../../../services/toaster.service';
import { uniqueNameInvalidStringReplace } from '../../../../shared/helpers/helperFunctions';
import { AppState } from '../../../../store';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';

@Component({
    selector: 'inventory-create-update-group',
    templateUrl: './create-update-group.component.html',
    styleUrls: ['./create-update-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryCreateUpdateGroupComponent implements OnInit, OnDestroy {
    /* This will store image path */
    public imgPath: string = '';
    /** Form Group for group form */
    public groupForm: FormGroup;
    /** Observable to hold stock groups */
    public groups$: Observable<IOption[]>;
    /* This will clear the select value in sh-select */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /** Holds input for file upload */
    public uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
    /** True if file upload is in progress */
    public isFileUploading: boolean = false;
    /** This holds session id */
    public sessionId$: Observable<string>;
    /** This holds company  */
    public companyUniqueName$: Observable<string>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Options for file upload */
    public fileUploadOptions: UploaderOptions = { concurrency: 0 };
    /** Holds group unique name if updating group  */
    public groupUniqueName: string = "";
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        private route: ActivatedRoute
    ) {
        this.sessionId$ = this.store.pipe(select(state => state.session.user.session.id), takeUntil(this.destroyed$));
        this.companyUniqueName$ = this.store.pipe(select(state => state.session.companyUniqueName), takeUntil(this.destroyed$));
        this.initGroupForm();

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params && params['groupUniqueName']) {
                this.groupUniqueName = params['groupUniqueName'];
                this.getGroupDetails();
            } else {
                this.groupUniqueName = "";
            }
        });
    }

    /**
     * Hook for component initialization
     *
     * @memberof InventoryCreateUpdateGroupComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.getParentGroups();
    }

    /**
     * Hook for component destroy
     *
     * @memberof InventoryCreateUpdateGroupComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Initializing the group form
     *
     * @private
     * @memberof InventoryCreateUpdateGroupComponent
     */
    private initGroupForm(): void {
        this.groupForm = this.formBuilder.group({
            name: ['', Validators.required],
            uniqueName: ['', Validators.required],
            showCodeType: ['hsn'],
            hsnNumber: [''],
            sacNumber: [''],
            parentStockGroupUniqueName: [''],
            isSubGroup: [false],
            outOfStockSelling: [false],
            image: this.formBuilder.group({
                uniqueName: [''],
                name: ['']
            })
        });
    }

    /**
     * Callback for change code type
     *
     * @memberof InventoryCreateUpdateGroupComponent
     */
    public changeCodeType(): void {
        if (this.groupForm.get('showCodeType').value === 'hsn') {
            this.groupForm?.patchValue({ sacNumber: "" });
        } else if (this.groupForm.get('showCodeType').value === 'sac') {
            this.groupForm?.patchValue({ hsnNumber: "" });
        }
    }

    /**
     * Creates/updates the group
     *
     * @memberof InventoryCreateUpdateGroupComponent
     */
    public saveGroup(): void {
        if (!this.groupForm?.get("image")?.get("uniqueName")?.value) {
            this.groupForm?.removeControl("image");
        }
        if (this.groupUniqueName) {
            this.inventoryService.updateStockGroup(this.groupForm.value, this.groupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.toaster.clearAllToaster();
                    this.toaster.successToast("Stock group updated successfully.");
                } else {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(response?.message);
                }
            });
        } else {
            this.inventoryService.createStockGroup(this.groupForm.value).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.resetGroupForm();
                    this.groupForm.addControl("image", this.formBuilder.group({
                        uniqueName: [''],
                        name: ['']
                    }));

                    this.toaster.clearAllToaster();
                    this.toaster.successToast("Stock group created successfully.");
                } else {
                    this.toaster.clearAllToaster();
                    this.toaster.errorToast(response?.message);
                }
            });
        }
    }

    /**
     * Gets the parent groups
     *
     * @private
     * @memberof InventoryCreateUpdateGroupComponent
     */
    private getParentGroups(): void {
        this.inventoryService.GetGroupsWithStocksFlatten().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data?.status === 'success') {
                let groups: IOption[] = [];
                this.arrangeGroups(data.body?.results, groups);
                this.groups$ = observableOf(groups);
            }
        });
    }

    /**
     * Rearranges stock groups
     *
     * @private
     * @param {IGroupsWithStocksHierarchyMinItem[]} rawList
     * @param {IOption[]} [parents=[]]
     * @memberof InventoryCreateUpdateGroupComponent
     */
    private arrangeGroups(rawList: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []): void {
        rawList.map(group => {
            if (group) {
                let newOption: IOption = { label: '', value: '' };
                newOption.label = group?.name;
                newOption.value = group?.uniqueName;
                parents.push(newOption);
                if (group?.childStockGroups && group?.childStockGroups.length > 0) {
                    this.arrangeGroups(group?.childStockGroups, parents);
                }
            }
        });
    }

    /**
     * Resets the group form
     *
     * @memberof InventoryCreateUpdateGroupComponent
     */
    public resetGroupForm(): void {
        this.groupForm.reset();
        this.groupForm?.patchValue({ showCodeType: "hsn" });
        this.forceClear$ = observableOf({ status: true });
    }

    /**
     * Generates the unique name based on name
     *
     * @memberof InventoryCreateUpdateGroupComponent
     */
    public generateUniqueName(): void {
        let val: string = this.groupForm.controls['name'].value;
        val = uniqueNameInvalidStringReplace(val);

        if (val) {
            this.groupForm?.patchValue({ uniqueName: val });
        } else {
            this.groupForm?.patchValue({ uniqueName: '' });
        }
    }

    /**
     * Validates the unique name
     *
     * @memberof InventoryCreateUpdateGroupComponent
     */
    public validateUniqueName(): void {
        if (this.groupForm.get('uniqueName')?.value) {
            let value = uniqueNameInvalidStringReplace(this.groupForm.get('uniqueName')?.value);
            this.groupForm?.patchValue({ uniqueName: value });
        }
    }

    /**
     * Uploads the file
     *
     * @param {UploadOutput} output
     * @memberof InventoryCreateUpdateGroupComponent
     */
    public onUploadOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') {
            let sessionKey = null;
            let companyUniqueName = null;
            this.sessionId$.pipe(take(1)).subscribe(a => sessionKey = a);
            this.companyUniqueName$.pipe(take(1)).subscribe(a => companyUniqueName = a);
            const event: UploadInput = {
                type: 'uploadAll',
                url: Configuration.ApiUrl + LEDGER_API.UPLOAD_FILE?.replace(':companyUniqueName', companyUniqueName),
                method: 'POST',
                fieldName: 'file',
                data: { company: companyUniqueName },
                headers: { 'Session-Id': sessionKey },
            };
            this.uploadInput.emit(event);
        } else if (output.type === 'start') {
            this.isFileUploading = true;
        } else if (output.type === 'done') {
            if (output.file.response?.status === 'success') {
                this.isFileUploading = false;
                this.groupForm?.get("image")?.patchValue({ uniqueName: output.file.response.body?.uniqueName, name: output.file.response.body?.name });
                this.toaster.successToast(this.commonLocaleData?.app_messages?.file_uploaded);
            } else {
                this.isFileUploading = false;
                this.groupForm?.get("image")?.patchValue({ uniqueName: "", name: "" });
                this.toaster.errorToast(output.file.response?.message);
            }
        }
    }

    /**
     * Gets the group details
     *
     * @private
     * @memberof InventoryCreateUpdateGroupComponent
     */
    private getGroupDetails(): void {
        this.inventoryService.getStockGroup(this.groupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body) {
                this.groupForm?.patchValue({
                    name: response.body.name,
                    uniqueName: response.body.uniqueName,
                    showCodeType: response.body.hsnNumber ? "hsn" : "sac",
                    hsnNumber: response.body.hsnNumber,
                    sacNumber: response.body.sacNumber,
                    parentStockGroupUniqueName: response.body.parentStockGroup?.uniqueName,
                    isSubGroup: [(response.body.parentStockGroup?.uniqueName) ? true : false],
                    outOfStockSelling: response.body.outOfStockSelling,
                    image: this.formBuilder.group({
                        uniqueName: response.body.image?.uniqueName,
                        name: response.body.image?.name
                    })
                });
            }
        });
    }
}
