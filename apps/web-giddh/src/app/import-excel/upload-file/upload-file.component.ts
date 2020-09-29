import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToasterService } from '../../services/toaster.service';

@Component({
    selector: 'upload-file',
    styleUrls: ['./upload-file.component.scss'],
    templateUrl: './upload-file.component.html',
})

export class UploadFileComponent implements OnInit, OnDestroy {
    @Input() public isLoading: boolean;
    @Input() public entity: string;
    @Output() public onFileUpload = new EventEmitter();
    public file: File = null;
    public selectedFileName: string = '';
    public selectedType: string = '';
    public title: string;

    /** Subject to unsubscribe all the listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private _toaster: ToasterService,
        private activatedRoute: ActivatedRoute
    ) {
        //
    }

    public onFileChange(file: FileList) {
        let validExts = ['csv', 'xls', 'xlsx'];
        let type = this.getExt(file.item(0).name);
        let isValidFileType = validExts.some(s => type === s);

        if (!isValidFileType) {
            this._toaster.errorToast('Only XLS files are supported for Import');
            this.selectedFileName = '';
            this.file = null;
            return;
        }

        this.file = file.item(0);
        if (this.file) {
            this.selectedFileName = this.file.name;
        } else {
            this.selectedFileName = '';
        }
    }

    public async downloadSampleFile(entity: string, isCsv: boolean = false) {
        const fileUrl = `assets/sample-files/${entity}-sample.${isCsv ? 'csv' : 'xlsx'}`;
        const fileName = `${entity}-sample.${isCsv ? 'csv' : 'xlsx'}`;
        try {
            let blob = await fetch(fileUrl).then(r => r.blob());
            saveAs(blob, fileName);
        } catch (e) {
            console.log('error while downloading sample file :', e);
        }
    }

    public getExt(path) {
        return (path.match(/(?:.+..+[^\/]+$)/ig) != null) ? path.split('.').pop(-1) : 'null';
    }

    /**
     * Initializes the component
     *
     * @memberof UploadFileComponent
     */

    public ngOnInit(): void {
        this.activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe(data => {
            this.entity = data.type;
            this.setTitle();
        });
        this.setTitle();
    }

    /**
     * Sets the title of the page according to type of entity
     *
     * @memberof UploadFileComponent
     */
    setTitle(): void {
        if (this.entity === 'group' || this.entity === 'account') {
            this.title = this.entity + 's';
        } else if (this.entity === 'stock') {
            this.title = 'inventories';
        } else if (this.entity === 'trial-balance') {
            this.title = 'Trial Balances';
        } else {
            this.title = this.entity;
        }
    }

    /**
     * Unsubscribes from all the listeners
     *
     * @memberof UploadFileComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
