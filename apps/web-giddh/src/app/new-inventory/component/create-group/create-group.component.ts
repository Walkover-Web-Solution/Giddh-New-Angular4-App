import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Configuration } from '../../../app.constant';
import { IForceClear } from '../../../models/api-models/Sales';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { InventoryService } from '../../../services/inventory.service';
import { ToasterService } from '../../../services/toaster.service';
import { uniqueNameInvalidStringReplace } from '../../../shared/helpers/helperFunctions';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';

@Component({
    selector: 'inventory-create-group',
    templateUrl: './create-group.component.html',
    styleUrls: ['./create-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryCreateGroupComponent implements OnInit, OnDestroy {
    /* This will store image path */
    public imgPath: string = '';
    /** Form Group for group form */
    public groupForm: FormGroup;
    public groups$: Observable<IOption[]>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
    public isFileUploading: boolean = false;
    public sessionKey$: Observable<string>;
    public companyName$: Observable<string>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public fileUploadOptions: UploaderOptions = { concurrency: 0 };

    constructor(
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private inventoryService: InventoryService,
        private toaster: ToasterService
    ) {
        this.sessionKey$ = this.store.pipe(select(state => state.session.user.session.id), takeUntil(this.destroyed$));
        this.companyName$ = this.store.pipe(select(state => state.session.companyUniqueName), takeUntil(this.destroyed$));
        this.initGroupForm();
    }

    public ngOnInit(): void {
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.getParentGroups();
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

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

    public changeCodeType(): void {
        if (this.groupForm.get('showCodeType').value === 'hsn') {
            this.groupForm?.patchValue({ sacNumber: "" });
        } else if (this.groupForm.get('showCodeType').value === 'sac') {
            this.groupForm?.patchValue({ hsnNumber: "" });
        }
    }

    public saveGroup(): void {
        this.inventoryService.createStockGroup(this.groupForm.value).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.resetGroupForm();
                this.toaster.clearAllToaster();
                this.toaster.successToast("Stock group created successfully.");
            } else {
                this.toaster.clearAllToaster();
                this.toaster.errorToast(response?.message);
            }
        })
    }

    private getParentGroups(): void {
        this.inventoryService.GetGroupsWithStocksFlatten().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.status === 'success') {
                let groups: IOption[] = [];
                this.arrangeGroups(data.body.results, groups);
                this.groups$ = observableOf(groups);
            }
        });
    }

    private arrangeGroups(rawList: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []): void {
        rawList.map(group => {
            if (group) {
                let newOption: IOption = { label: '', value: '' };
                newOption.label = group.name;
                newOption.value = group.uniqueName;
                parents.push(newOption);
                if (group.childStockGroups && group.childStockGroups.length > 0) {
                    this.arrangeGroups(group.childStockGroups, parents);
                }
            }
        });
    }

    public resetGroupForm(): void {
        this.groupForm.reset();
        this.groupForm?.patchValue({ showCodeType: "hsn" });
        this.forceClear$ = observableOf({ status: true });
    }

    public generateUniqueName(): void {
        let val: string = this.groupForm.controls['name'].value;
        val = uniqueNameInvalidStringReplace(val);

        if (val) {
            this.groupForm?.patchValue({ uniqueName: val });
        } else {
            this.groupForm?.patchValue({ uniqueName: '' });
        }
    }

    public validateUniqueName(): void {
        if (this.groupForm.get('uniqueName')?.value) {
            let value = uniqueNameInvalidStringReplace(this.groupForm.get('uniqueName')?.value);
            this.groupForm?.patchValue({ uniqueName: value });
        }
    }

    public onUploadOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') {
            let sessionKey = null;
            let companyUniqueName = null;
            this.sessionKey$.pipe(take(1)).subscribe(a => sessionKey = a);
            this.companyName$.pipe(take(1)).subscribe(a => companyUniqueName = a);
            const event: UploadInput = {
                type: 'uploadAll',
                url: Configuration.ApiUrl + LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName),
                method: 'POST',
                fieldName: 'file',
                data: { company: companyUniqueName },
                headers: { 'Session-Id': sessionKey },
            };
            this.uploadInput.emit(event);
        } else if (output.type === 'start') {
            this.isFileUploading = true;
        } else if (output.type === 'done') {
            if (output.file.response.status === 'success') {
                this.isFileUploading = false;
                this.groupForm?.get("image")?.patchValue({ uniqueName: output.file.response.body?.uniqueName });
                this.groupForm?.get("image")?.patchValue({ name: output.file.response.body?.name });
                this.toaster.successToast(this.commonLocaleData?.app_messages?.file_uploaded);
            } else {
                this.isFileUploading = false;
                this.groupForm?.get("image")?.patchValue({ uniqueName: "" });
                this.groupForm?.get("image")?.patchValue({ name: "" });
                this.toaster.errorToast(output.file.response.message);
            }
        }
    }
}
