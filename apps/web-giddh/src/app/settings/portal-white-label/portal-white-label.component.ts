import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { OrganizationType } from '../../models/user-login-state';
import { ReplaySubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SettingsProfileService } from '../../services/settings.profile.service';
import { ToasterService } from '../../services/toaster.service';

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
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Instance of portal while label form */
    public portalWhilteLabelForm: UntypedFormGroup;
    /** Stores the white label Random generate string */
    public generatedString: string;
    /** Hold verify url name */
    public urlVerifiedButtonName: string = 'Verify';
    /** True if user is verified*/
    public verifiedButton: boolean = false;

    constructor(private fb: UntypedFormBuilder, private settingsProfileService: SettingsProfileService, private toaster: ToasterService, private changeDetectorRef: ChangeDetectorRef) { }

    /**
     * This will be use for component initialization
     *
     * @return {*}  {void}
     * @memberof PortalWhiteLabelComponent
     */
    public ngOnInit(): void {
        this.initializeForm();
        if (this.portalWhilteLabelForm.value.url.length) {
            return;
        } else {
            this.getDomainList();
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
                    this.generatedString = this.generateRandomString(urlWithoutProtocol);
                } else {
                    this.generatedString = '';
                }
            });
    }
    /**
     * This will be use for input change
     *
     * @memberof PortalWhiteLabelComponent
     */
    public onInputChange(): void {
        this.verifiedButton = false;
        this.urlVerifiedButtonName = 'Verify';
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
        this.settingsProfileService.getDomainList().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.status === 'success') {
                if (response?.body?.domainList?.length) {
                    this.portalWhilteLabelForm.get('url')?.setValue(response?.body?.domainList[0]);
                    this.generatedString = response?.body?.domainList[1];
                    this.urlVerifiedButtonName = response?.body?.verified ? 'Verified' : 'Verify';
                    this.verifiedButton = response.body.verified;
                }
            } else {
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
     * This will be use for generating random URLs
     *
     * @param {string} value
     * @return {*}  {string}
     * @memberof PortalWhiteLabelComponent
     */
    public generateRandomString(value: string): string {
        const randomLength = 8; // Adjust the length of the random string as needed
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < randomLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result + '.' + value;
    }

    /**
     * This wll be use for submit form
     *
     * @memberof PortalWhiteLabelComponent
     */
    public submitForm(): void {
        const urlWithoutProtocol = this.removeProtocol(this.portalWhilteLabelForm.get('url')?.value);
        let requestData = [urlWithoutProtocol, this.generatedString];
        this.settingsProfileService.verifyPortalWhilteLabel(requestData).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.status === 'success') {
                this.urlVerifiedButtonName = 'Verified';
                this.verifiedButton = true;
            } else {
                this.toaster.errorToast(response.message);
            }
            this.changeDetectorRef.detectChanges();
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
