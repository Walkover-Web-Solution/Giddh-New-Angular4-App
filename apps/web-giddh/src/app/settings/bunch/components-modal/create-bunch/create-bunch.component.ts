import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '../../../../services/toaster.service';
import { SettingsBunchService } from '../../../../services/settings.bunch.service';

@Component({
    selector: 'create-bunch-component',
    templateUrl: './create-bunch.component.html'
})

export class CreateBunchModalComponent implements OnChanges {

    @Input() public mode: string;
    @Input() public formData: any = {};
    @Output() public closeModalEvent: EventEmitter<boolean> = new EventEmitter(false);
    @Output() public saveDataEvent: EventEmitter<any> = new EventEmitter(null);

    public addBunchForm: FormGroup;

    constructor(private _fb: FormBuilder,
        private _toaster: ToasterService,
        private _settingsBunchService: SettingsBunchService,
    ) {

        this.addBunchForm = this._fb.group({
            name: ['', Validators.required],
            uniqueName: ['', Validators.required],
            description: [''],
        });

    }

    /**
     * create
     */
    public createBunch() {
        let dataToSend = _.cloneDeep(this.addBunchForm.value);
        this.saveDataEvent.emit(dataToSend);
        // this._settingsBunchService.CreateBunch(dataToSend);
    }

    public onCancel() {
        this.addBunchForm.reset();
        this.closeModalEvent.emit(true);
    }

    public generateUniqueName() {
        let control = this.addBunchForm.get('name');
        let uniqueControl = this.addBunchForm.get('uniqueName');
        let unqName = control.value;
        unqName = unqName.replace(/ |,|\//g, '');
        unqName = unqName.toLowerCase();
        if (unqName.length >= 1) {
            let unq = '';
            let text = '';
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            let i = 0;
            while (i < 3) {
                text += chars.charAt(Math.floor(Math.random() * chars.length));
                i++;
            }
            unq = unqName + text;
            uniqueControl.patchValue(unq);
        } else {
            uniqueControl.patchValue('');
        }
    }

    /**
     * ngOnChanges
     */
    public ngOnChanges(s) {
        if (s && s.mode && s.mode.currentValue === 'update') {
            this.addBunchForm.patchValue({
                name: s.formData.currentValue.name,
                uniqueName: s.formData.currentValue.uniqueName,
                description: s.formData.currentValue.description
            });
        } else {
            this.addBunchForm.reset();
        }
    }
}
