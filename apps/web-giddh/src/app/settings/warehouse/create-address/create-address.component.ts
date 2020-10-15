import { Component, OnInit, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IForceClear } from '../../../models/api-models/Sales';
import { ToasterService } from '../../../services/toaster.service';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { SettingsAsideConfiguration, SettingsAsideFormType } from '../../constants/settings.constant';

function validateFieldWithPatterns(patterns: Array<string>) {
    return (field: FormControl): { [key: string]: any } => {
        return !field.value || patterns.some(pattern => new RegExp(pattern).test(field.value)) ? null : {
            validateFieldWithPatterns: {
                valid: false
            }
        }
    }
}

@Component({
    selector: 'create-address',
    templateUrl: './create-address.component.html',
    styleUrls: ['./create-address.component.scss'],
})
export class CreateAddressComponent implements OnInit, OnDestroy {

    @Output() public closeAsideEvent: EventEmitter<any> = new EventEmitter();
    @Output() public saveAddress: EventEmitter<any> = new EventEmitter();

    public addressForm: FormGroup;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** Address configuration */
    @Input() public addressConfiguration: SettingsAsideConfiguration;

    constructor(
        private formBuilder: FormBuilder,
        private toasterService: ToasterService
    ) {
    }

    public ngOnInit(): void {
        if (this.addressConfiguration && this.addressConfiguration.type === SettingsAsideFormType.CreateAddress) {
            const taxValidatorPatterns = this.addressConfiguration.tax.name ? this.addressConfiguration.tax.validation : [];
            this.addressForm = this.formBuilder.group({
                name: ['', Validators.required],
                taxNumber: ['', (taxValidatorPatterns && taxValidatorPatterns.length) ? validateFieldWithPatterns(taxValidatorPatterns) : null],
                state: ['', Validators.required],
                address: [''],
                linkedEntity: [[]]
            });
        }
        if (this.addressConfiguration.tax.name) {
            const taxField = this.addressForm.get('taxNumber');
            taxField.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
                if (taxField.valid) {
                    this.addressForm.get('address').setValidators([Validators.required]);
                } else {
                    this.addressForm.get('address').setValidators(null);
                }
                this.addressForm.get('address').updateValueAndValidity();
            });
        }
    }

    public closeAsidePane(event) {
        this.closeAsideEvent.emit(event);
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    handleFormSubmit(event) {
        this.saveAddress.emit({
            formValue: this.addressForm.value,
            addressDetails: this.addressConfiguration
        });
    }

    public getStateCode(statesEle: ShSelectComponent, event: KeyboardEvent) {
        const keyAvoid = ['Tab', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];
        if (keyAvoid.findIndex(key => key === event.key) > -1) {
            return;
        }
        let gstVal: string = this.addressForm.get('taxNumber').value.trim();
        this.addressForm.get('taxNumber').setValue(gstVal.trim());
        if (gstVal.length) {

            if (gstVal.length >= 2) {
                let currentState = this.addressConfiguration.stateList.find(state => state.code === gstVal.substring(0, 2));
                if (currentState) {
                    this.addressForm.get('state').patchValue(currentState.value);
                } else {
                    this.addressForm.get('state').patchValue(null);
                    if (this.addressConfiguration.tax.name) {
                        this.toasterService.errorToast(`Invalid ${this.addressConfiguration.tax.name}`);
                    }
                }
            } else {
                statesEle.forceClearReactive.status = true;
                statesEle.clear();
                this.addressForm.get('state').patchValue(null);
            }
        } else {
            statesEle.forceClearReactive.status = true;
            statesEle.clear();
            this.addressForm.get('state').patchValue(null);
        }
    }

    public setDefault(option: any, event: any): void {
        if (option.isDefault || option.isHilighted) {
            event.stopPropagation();
            event.preventDefault();
        }
        option.isDefault = !option.isDefault;
        if (option.isDefault) {
            this.addressForm.get('linkedEntity').patchValue([
                ...this.addressForm.get('linkedEntity').value,
                option.value
            ]);
        }
    }

    public selectEntity(option: any): void {
        if (option.isDefault) {
            option.isDefault = false;
        }
    }
}
