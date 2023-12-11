import { ChangeDetectorRef, Component, HostListener, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OrganizationType } from '../../models/user-login-state';
import { ReplaySubject, debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SettingsProfileService } from '../../services/settings.profile.service';
import { ToasterService } from '../../services/toaster.service';
import { ClipboardService } from 'ngx-clipboard';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { IOption } from '../../theme/ng-select/option.interface';
import { EMAIL_VALIDATION_REGEX } from '../../app.constant';
export interface GetDomainList {
    type: any;
    hostName: any;
    value: any;
    status: any;
    isCopiedHostName: boolean;
    isCopiedValue: boolean;
}
/** Hold information of activity logs */
const ELEMENT_DATA: GetDomainList[] = [];
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
    /** Instance of portal shared email form */
    public shareEmailForm: UntypedFormGroup;
    /** Stores the white label Random generate string */
    public generatedString: string;
    /** True if API is in progress */
    public shouldShowLoader: boolean;
    /** Hold domain list */
    public domainList: IOption[] = [];
    /** Hold the data of activity logs */
    public dataSource = ELEMENT_DATA;
    /** This will use for table heading */
    public displayedColumns: string[] = ['type', 'hostName', 'value', 'status'];
    /** This will hold domain unique name */
    public domain: any = {
        name: '',
        uniqueName: '',
        status: ''
    };

    constructor(private fb: UntypedFormBuilder,
        private settingsProfileService: SettingsProfileService,
        private toaster: ToasterService,
        private changeDetectorRef: ChangeDetectorRef,
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
        this.getDomainList(true);
    }

    @HostListener('paste', ['$event'])
    public onPaste(event): void {
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
                    this.generatedString = new Date().getTime() + '.' + urlWithoutProtocol;
                } else {
                    this.generatedString = '';
                }
            });
    }

    /**
     * This will be use for input changef
     *
     * @memberof PortalWhiteLabelComponent
     */
    public onInputChange(): void {
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
        this.shareEmailForm = this.fb.group({
            recipients: ['']
        });
    }

    /**
     * This will be use for verify domain
     *
     * @memberof PortalWhiteLabelComponent
     */
    public verifyDomain(): void {
        this.shouldShowLoader = true;
        this.settingsProfileService.verifyPortalWhilteLabel(this.domain.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.status === 'success') {
                this.toaster.showSnackBar("success", response.body);
                this.shouldShowLoader = false;
                this.getDomainList(false);
                let event = {
                    label: this.domain.name,
                    value: this.domain.uniqueName,
                    status: this.domain.status
                }
                this.selectDomain(event);
            } else {
                this.shouldShowLoader = false;
                this.toaster.showSnackBar("error", response.message);
            }
        });
        this.changeDetectorRef.detectChanges();
    }

    /**
     * This will be use for select domain
     *
     * @param {*} event
     * @memberof PortalWhiteLabelComponent
     */
    public selectDomain(event: any): void {
        if (event) {
            this.domain.name = event.label;
            this.domain.uniqueName = event.value;
            this.domain.status = event.status;
            this.getDomainListData(this.domain.uniqueName);
        }
    }

    /**
     * This will be use for send email
     *
     * @return {*}  {void}
     * @memberof PortalWhiteLabelComponent
     */
    public sendEmail(): void {
        let validRecipients: boolean = true;
        if (this.shareEmailForm.get('recipients')?.value) {
            let recipients = this.shareEmailForm.get('recipients')?.value.split(",");
            let validEmails = [];
            let uniqueArray = [];
            if (recipients && recipients.length > 0) {
                recipients.forEach(email => {
                    if (validRecipients && email.trim() && !EMAIL_VALIDATION_REGEX.test(email.trim())) {
                        this.toaster.clearAllToaster();
                        let invalidEmail = this.localeData?.invalid_email;
                        invalidEmail = invalidEmail?.replace("[EMAIL]", email);
                        this.toaster.showSnackBar("error", invalidEmail);
                        validRecipients = false;
                    }

                    if (validRecipients && email.trim() && EMAIL_VALIDATION_REGEX.test(email.trim())) {
                        validEmails.push(email.trim());
                        uniqueArray = [...new Set(validEmails)];
                    }
                });
                if (!validRecipients) {
                    return;
                }
                this.settingsProfileService.sharedDomainEmail(uniqueArray, this.domain.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                    if (response && response.status === 'success') {
                        this.toaster.showSnackBar("success", response?.body);
                        this.dialog?.closeAll();
                        this.shareEmailForm.reset();
                    } else {
                        this.toaster.showSnackBar("error", response.message);
                    }
                    this.changeDetectorRef.detectChanges();
                });
            }
        }
    }

    /**
     * This will be use for get domain information
     *
     * @param {string} uniqueName
     * @memberof PortalWhiteLabelComponent
     */
    public getDomainListData(uniqueName: string): void {
        this.shouldShowLoader = true;
        this.settingsProfileService.getDomainListTableData(uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.status === 'success') {
                this.shouldShowLoader = false;
                if (response?.body?.length) {
                    this.dataSource = response.body?.map(portal => {
                        return { type: 'CNAME', hostName: portal.domainName, value: 'portal.giddh.com', status: portal.verified, isCopiedHostName: false, isCopiedValue: false };
                    });
                }
            } else {
                this.toaster.showSnackBar("error", response.message);
                this.shouldShowLoader = false;
            }
        });
        this.changeDetectorRef.detectChanges();
    }

    /**
     * This will be use for set primary domain
     *
     * @param {string} operation
     * @param {string} [uniqueName]
     * @memberof PortalWhiteLabelComponent
     */
    public setPrimaryAndDeleteDomain(operation: string, uniqueName?: string): void {
        this.settingsProfileService.setPrimaryDeleteDomain(uniqueName, operation).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.status === 'success') {
                if (operation === 'set-primary') {
                    this.toaster.showSnackBar("success", this.localeData?.primary_domain_set);
                } else {
                    this.toaster.showSnackBar("success", this.localeData?.delete_domain);
                }
                if (operation === 'delete') {
                    this.getDomainList(true);
                    this.portalWhilteLabelForm.reset();
                    this.dialog.closeAll();
                }
                for (const item of this.domainList as any) {
                    if (item.value === uniqueName) {
                        item.status = true;
                    } else {
                        item.status = false;
                    }
                }
            } else {
                this.toaster.showSnackBar("error", response.message);
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     * This will be use for get dropdown domain list
     *
     * @memberof PortalWhiteLabelComponent
     */
    public getDomainList(apiCall: boolean): void {
        this.settingsProfileService.getDomainList().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.status === 'success') {
                if (response?.body?.length) {
                    if (apiCall) {
                        let event = {
                            label: response.body[0].domainName,
                            value: response.body[0].uniqueName,
                            status: response.body[0].primary
                        }
                        this.selectDomain(event);
                    }
                    this.domainList = response.body?.map(portal => {
                        return { label: portal.domainName, value: portal.uniqueName, status: portal.primary };
                    });
                }
            } else {
                this.toaster.showSnackBar("error", response.message);
            }
        });
        this.changeDetectorRef.detectChanges();
    }

    /**
     * This will be use for remove protocol from url
     * Remove 'http://' or 'https://'
     * @param {string} value
     * @return {*}  {string}
     * @memberof PortalWhiteLabelComponent
     */
    public removeProtocol(value: string): string {
        return value?.replace(/^(https?|ftp):\/\//, '');
    }

    /**
     * This wll be use for submit form
     *
     * @memberof PortalWhiteLabelComponent
     */
    public submitForm(): void {
        const urlWithoutProtocol = this.removeProtocol(this.portalWhilteLabelForm.get('url')?.value);
        let requestData = [urlWithoutProtocol, this.generatedString];
        this.settingsProfileService.addPortalDomain(requestData).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.status === 'success') {
                this.toaster.showSnackBar("success", this.localeData?.add_domain_succesfully);
                this.portalWhilteLabelForm.reset();
                this.getDomainList(false);
                let event = {
                    label: response.body[0].domainName,
                    value: response.body[0].uniqueName,
                    status: response.body[0].primary || false
                }
                this.selectDomain(event)
                this.dialog.closeAll();
            } else {
                this.toaster.showSnackBar("error", response.message);
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
    *This will use for copy api url link and display copied
    *
    * @memberof PersonalInformationComponent
    */
    public copyUrl(value: any, host: any, type: any): void {
        const urlToCopy = value;
        this.clipboardService.copyFromContent(urlToCopy);
        if (type === 'host') {
            host.isCopiedHostName = true;
        } else {
            host.isCopiedValue = true;
        }
        setTimeout(() => {
            host.isCopiedHostName = false;
            host.isCopiedValue = false;
        }, 3000);
    }

    /**
     * This will be use for delete confirmation popup
     *
     * @memberof PortalWhiteLabelComponent
     */
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
                this.setPrimaryAndDeleteDomain('delete', this.domain.uniqueName);
            } else {
                this.dialog.closeAll();
            }
        });
    }

    /**
     * This wll be use for open send email dialog
     *
     * @memberof PortalWhiteLabelComponent
     */
    public openShareDomainDialog(): void {
        this.dialog.open(this.shareDomain, {
            width: '500px'
        });
    }

    /**
     * This wll be use for open add domain dialog
     *
     * @memberof PortalWhiteLabelComponent
     */
    public openAddDomainDialog(): void {
        this.dialog.open(this.addDomain, {
            width: '550px'
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
