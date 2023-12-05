import { ChangeDetectorRef, Component, HostListener, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OrganizationType } from '../../models/user-login-state';
import { ReplaySubject, debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SettingsProfileService } from '../../services/settings.profile.service';
import { ToasterService } from '../../services/toaster.service';
import { GeneralService } from '../../services/general.service';
import { ClipboardService } from 'ngx-clipboard';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';

@Component({
    selector: 'portal-white-label',
    templateUrl: './portal-white-label.component.html',
    styleUrls: ['./portal-white-label.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})
export class PortalWhiteLabelComponent implements OnInit {
    /** Stores the type of the organization (company or profile)  */
    @Input() public organizationType: OrganizationType;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Share domain popup template ref */
    @ViewChild('shareDomain') shareDomain: TemplateRef<any>;
    /** Add domain popup template ref */
    @ViewChild('addDomain') addDomain: TemplateRef<any>;
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Instance of portal while label form */
    public portalWhilteLabelForm: UntypedFormGroup;
    /** Stores the white label Random generate string */
    public generatedString: string;
    /** True if user is verified*/
    public showDomainButton: boolean = false;
    /** True if API is in progress */
    public shouldShowLoader: boolean;
    /** Hold domain list */
    public domainList: any[] = [];
    /** This will hold isCopied */
    public isHostNameCopied: boolean = false;
    /** This will hold isCopied */
    public isValueCopied: boolean = false;
    /** Table columns */
    public displayedColumns: string[] = ['type', 'hostName', 'value', 'status'];
    /** Holds list of data */
    public dataSource: any = [
        { type: 'CNAME', hostName: 'hrishabh.elitevysya.com', value: 'v=spfl include:mailer91.com', status: true },
        { type: 'CNAME', hostName: 'hrishabh.elitevysya.com', value: 'v=spfl include:mailer91.com', status: false }];

    constructor(private fb: UntypedFormBuilder,
        private settingsProfileService: SettingsProfileService,
        private toaster: ToasterService,
        private changeDetectorRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private clipboardService: ClipboardService,
        private dialog: MatDialog) { }

    /**
     * This will be use for component initialization
     *
     * @return {*}  {void}
     * @memberof PortalWhiteLabelComponent
     */
    public ngOnInit(): void {
        this.initializeForm();
        this.getDomainList();
    }

    @HostListener('paste', ['$event'])
    public onPaste(event) {
        if (event) {
            this.subscribeToFormChanges();
        }
    }

    /**
     * This will be use for input  observable subscribe
     *
     * @memberof PortalWhiteLabelComponent
     */
    public subscribeToFormChanges(): void {
        this.portalWhilteLabelForm.get('url').valueChanges
            .pipe(debounceTime(700),
                distinctUntilChanged(),
                takeUntil(this.destroyed$))
            .subscribe((value) => {
                if (value) {
                    const urlWithoutProtocol = this.removeProtocol(value);
                    this.generatedString = this.generalService.generateRandomString(urlWithoutProtocol);
                    this.showDomainButton = true;
                } else {
                    this.generatedString = '';
                    this.showDomainButton = false;
                }
            });
    }
    /**
     * This will be use for input changef
     *
     * @memberof PortalWhiteLabelComponent
     */
    public onInputChange(event): void {
        console.log("event", event);
        return;
        this.showDomainButton = true;
        this.subscribeToFormChanges();
    }

    /**
     * This will be use for initialisation form
     *
     * @memberof PortalWhiteLabelComponent
     */
    public initializeForm(): void {
        this.portalWhilteLabelForm = this.fb.group({
            url: ['']
        });
    }

    /**
     * This will be use for get domain list
     *
     * @memberof PortalWhiteLabelComponent
     */
    public getDomainList(): void {
        this.shouldShowLoader = true;
        this.settingsProfileService.getDomainList().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.status === 'success') {
                this.domainList = [];
                this.shouldShowLoader = false;
                if (response?.body?.domainList?.length) {
                    this.domainList = [{
                        type: 'CNAME',
                        hostname: response.body?.domainList[0],
                        value: response.body?.domainList[1],
                        status: response.body.verified
                    }];
                }
            } else {
                this.shouldShowLoader = false;
                this.toaster.errorToast(response.message);
            }
        });
        this.changeDetectorRef.detectChanges();
    }

    /**
     * This will be use for remove protocol from url
     *
     * @param {string} value
     * @return {*}  {string}
     * @memberof PortalWhiteLabelComponent
     */
    public removeProtocol(value: string): string {
        // Remove 'http://' or 'https://'
        return value.replace(/^(https?|ftp):\/\//, '');
    }

    /**
     * This wll be use for submit form
     *
     * @memberof PortalWhiteLabelComponent
     */
    public submitForm(): void {
        const urlWithoutProtocol = this.removeProtocol(this.portalWhilteLabelForm.get('url')?.value);
        let requestData = [urlWithoutProtocol, 'api.giddh.com'];
        this.settingsProfileService.verifyPortalWhilteLabel(requestData).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.status === 'success') {
                this.toaster.successToast('Domain successfully added')
                this.getDomainList();
                this.portalWhilteLabelForm.reset();
            } else {
                this.toaster.errorToast(response.message);
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
    *This will use for copy api url link and display copied
    *
    * @memberof PersonalInformationComponent
    */
    public copyUrl(value: any, type: any): void {
        const urlToCopy = value;
        this.clipboardService.copyFromContent(urlToCopy);
        if (type === 'host') {
            this.isHostNameCopied = true;
        } else {
            this.isValueCopied = true;
        }
        setTimeout(() => {
            if (type === 'host') {
                this.isHostNameCopied = false;
            } else {
                this.isValueCopied = false;
            }
        }, 3000);
    }

    public deleteConfirmationDialog(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.commonLocaleData?.app_delete,
                body: this.localeData?.delete_message,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.commonLocaleData?.app_permanently_delete_message
            },
            width: '600px'
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                console.log("Deleted");

            } else {
                console.log("Cancel Deleted");
            }
        });
    }

    public openShareDomainDialog(): void {
        this.dialog.open(this.shareDomain, {
            width: '500px'
        });
    }

    public openAddDomainDialog(): void {
        this.dialog.open(this.addDomain, {
            width: '650px'
        });
    }

    /**
     * Unsubscribes from listeners
     *
     * @memberof PortalWhiteLabelComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
