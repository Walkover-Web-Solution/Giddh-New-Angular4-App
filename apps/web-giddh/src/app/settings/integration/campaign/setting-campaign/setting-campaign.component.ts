import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component';
import { API_COUNT_LIMIT, EMAIL_VALIDATION_REGEX, MOBILE_REGEX_PATTERN, PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { CampaignIntegrationService } from 'apps/web-giddh/src/app/services/campaign.integraion.service';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-select/option.interface';
import { GIDDH_NEW_DATE_FORMAT_UI } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';

export interface ActiveTriggers {
    title: string;
    type: string;
    createdAt: string;
    uniqueName: string;
    argsMapping: string;
    isActive: boolean;
}
@Component({
    selector: 'app-setting-campaign',
    templateUrl: './setting-campaign.component.html',
    styleUrls: ['./setting-campaign.component.scss']
})
export class SettingCampaignComponent implements OnInit {

    /** Holds image path */
    public imgPath: string = '';
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Active trigger columns */
    public activeTriggersColumns: string[] = ['title', 'type', 'argsMapping', 'createdAt', 'action'];
    /** Data source for active triggers list */
    public activeTriggersDataSource: ActiveTriggers[] = [];
    /** Holds communication platforms */
    public communicationPlatforms: any = {};
    /** Communication platform auth model  */
    public communicationPlatformAuthModel: any = {
        platform: "",
        authFields: [{
            name: "authKey",
            value:''
        }]
    };
    /** True if communication platform get api in progress */
    public isCommunicationPlatformsLoading: boolean = true;
    /** True if communication platform verification api in progress */
    public isCommunicationPlatformVerificationInProcess: boolean = false;
    /** Holds the communication platform which is in edit mode */
    public editCommunicationPlatform: string = "";
    /** True if need to show trigger form */
    public showTriggerForm: boolean = false;
    /** List of field suggestions */
    public fieldsSuggestion: any[] = [];
    /** List of action */
    public subConditionAction: any[] = [];
    /** List of campaign list */
    public campaignList: any[] = [];
    /** Instance of create trigger form*/
    public createTrigger;
    /** Holds the communication platform */
    public platform: string = '';
    /** Holds the communication trigger uniquename */
    public triggerUniquename: string = '';
    /** Emit with seperate code for chiplist */
    public separatorKeysCodes: number[] = [ENTER, COMMA];
    /** Holds the trigger to chiplist data */
    public triggerToChiplist: any[] = [];
    /** Holds the trigger bcc chiplist data */
    public triggerBccChiplist: any[] = [];
    /** Holds the trigger cc chiplist data */
    public triggerCcChiplist: any[] = [];
    /** Holds the trigger to dropdown data */
    public triggerToDropdown: any[] = [];
    /** Holds the trigger bcc dropdown data */
    public triggerBccDropdown: any[] = [];
    /** Holds the trigger cc dropdown data */
    public triggerCcDropdown: any[] = [];
    /** Holds the trigger condtiion action  */
    public triggerConditionAction: any[] = [];
    /** True if  the trigger loading  */
    public isActiveTriggersLoading: boolean = false;
    /** Validate the email regex for add emails */
    public EMAIL_REGEX_PATTERN = EMAIL_VALIDATION_REGEX;
    /** Validate the mobileregex for add mobile */
    public MOBILE_REGEX_PATTERN = MOBILE_REGEX_PATTERN;
    /** Holds the trigger mode */
    public triggerMode: 'create' | 'copy' | 'update' = 'create';
    /** Holds the trigger condtiion   */
    public triggerCondition: IOption[] = [];
    /** Holds the trigger entity   */
    public triggerEntity: IOption[] = [];
    /** Holds the trigger object   */
    public triggerObj = {
        count: API_COUNT_LIMIT,
        page: 1,
        totalItems: 0,
        totalPages: 0,
    }
    /** True if  the variables showing   */
    public showVariableMapping: boolean = false;
    /** Hold instance of destroyed   */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds the trigger condtiion action  */
    public tiggerConditionAction: any[] = [];

    constructor(private campaignIntegrationService: CampaignIntegrationService,
        private toasty: ToasterService,
        private dialog: MatDialog
    ) {
        this.resetCommunicationForm();

    }

    /**
     * This hook will use for init
     *
     * @memberof SettingCampaignComponent
     */
    public ngOnInit(): void {
        this.imgPath = (isElectron) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.getCommunicationPlatforms();
    }

    /**
    * Get platforms and fields for integration
    *
    * @private
    * @memberof SettingCampaignComponent
    */
    private getCommunicationPlatforms(): void {
        this.isCommunicationPlatformsLoading = true;
        this.campaignIntegrationService.getCommunicationPlatforms().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                if (this.editCommunicationPlatform = '') {
                    this.communicationPlatformAuthModel.authFields[0].value = [];
                } else {
                    this.communicationPlatformAuthModel.authFields[0].value = response?.body?.platforms[0]?.fields[0]?.value;
                }
                if (response?.body?.platforms?.length > 0) {
                    response.body.platforms?.forEach(platform => {
                        this.communicationPlatforms[platform?.name] = [];
                        this.communicationPlatforms[platform?.name].name = platform?.name;
                        this.communicationPlatforms[platform?.name].uniqueName = platform?.uniqueName;

                        let fields = [];
                        platform?.fields?.forEach(pt => {
                            fields[pt?.field] = pt;
                        });
                        this.communicationPlatforms[platform?.name].fields = fields;
                        this.communicationPlatforms[platform?.name].isConnected = (this.communicationPlatforms[platform?.name]['fields']?.auth_key?.value);
                    });
                }
                if (this.communicationPlatforms['MSG91'].isConnected) {
                    this.getTriggers();
                    this.platform = response?.body?.platforms[0]?.name;
                    this.createTrigger.communicationPlatform = this.platform;
                }
                this.isCommunicationPlatformsLoading = false;
            } else {
                this.toasty.showSnackBar("error", response?.message);
                this.isCommunicationPlatformsLoading = false;
            }
        });
    }

    /**
     * Verifies the integration with communication platform
     *
     * @param {string} platform
     * @memberof SettingCampaignComponent
     */
    public verifyCommunicationPlatform(platform: string): void {
        this.isCommunicationPlatformVerificationInProcess = true;
        this.communicationPlatformAuthModel.platform = platform;
        this.campaignIntegrationService.verifyCommunicationPlatform(this.communicationPlatformAuthModel).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasty.showSnackBar("success", platform + this.localeData?.communication?.platform_success);
                this.getCommunicationPlatforms();
            } else {
                this.toasty.showSnackBar("error", response?.message);
            }
            this.isCommunicationPlatformVerificationInProcess = false;
        });
    }

    /**
     * Deletes the integration with communication platform
     *
     * @param {string} platformUniqueName
     * @memberof SettingCampaignComponent
     */
    public deleteCommunicationPlatform(platformUniqueName: string): void {
        let dialogRef = this.dialog?.open(ConfirmModalComponent, {
            width: '40%',
            data: {
                title: this.commonLocaleData?.app_delete,
                body: this.localeData?.communication?.delete_platform,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef?.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.campaignIntegrationService.deleteCommunicationPlatform(platformUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === "success") {
                        this.toasty.showSnackBar("success", response?.body);
                        this.getCommunicationPlatforms();
                    } else {
                        this.toasty.showSnackBar("error", response?.message);
                    }
                });
            }
        });
    }

    /**
     * Gets the list of triggers
     *
     * @memberof SettingCampaignComponent
     */
    public getTriggers(): void {
        this.isActiveTriggersLoading = true;
        this.activeTriggersDataSource = [];
        let requestObj = {
            count: PAGINATION_LIMIT
        }
        this.campaignIntegrationService.getTriggersList(requestObj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                if (response?.body?.items?.length > 0) {
                    response?.body?.items?.forEach(trigger => {
                        trigger.createdAt = dayjs(trigger.createdAt).format(GIDDH_NEW_DATE_FORMAT_UI);
                        const argsMapping = [];
                        this.triggerUniquename = trigger?.uniqueName;
                        if (trigger?.argsMapping?.length > 0) {
                            trigger?.argsMapping?.forEach(arg => {
                                argsMapping?.push(arg?.name + " -> " + arg?.value);
                            });
                        }
                        this.activeTriggersDataSource.push({ title: trigger?.title, type: trigger?.communicationPlatform, createdAt: trigger?.createdAt, uniqueName: trigger?.uniqueName, argsMapping: argsMapping?.join(", "), isActive: trigger?.isActive });
                        this.triggerObj.totalItems = response.body.totalItems;
                        this.triggerObj.totalPages = response.body.totalPages;
                    });
                }
                this.isActiveTriggersLoading = false;
            } else {
                this.toasty.showSnackBar("error", response?.body);
                this.isActiveTriggersLoading = false;
                this.triggerObj.totalItems = 0;
                this.triggerObj.totalPages = 0;
            }
        });
    }

    /**
     * Gets the field suggestions
     *
     * @param {string} platform
     * @param {*} entity
     * @memberof SettingCampaignComponent
     */
    public getFieldsSuggestion(platform: string, entity: any): void {
        this.campaignIntegrationService.getFieldSuggestions(platform, entity).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                if (response) {
                    this.triggerBccDropdown.push({
                        value: response.body?.sendToSuggestions[0],
                        label: response.body?.sendToSuggestions[0]
                    })

                    this.triggerCcDropdown.push({
                        value: response.body?.sendToSuggestions[0],
                        label: response.body?.sendToSuggestions[0]
                    })

                    this.triggerToDropdown = response.body?.sendToSuggestions?.map((result: any) => {
                        return {
                            value: result,
                            label: result
                        }
                    });
                    this.fieldsSuggestion = response.body?.suggestions?.map((result: any) => {
                        return {
                            value: result,
                            label: result
                        }
                    });
                    this.subConditionAction = response.body?.subCondition[0].action;
                }
            } else {
                this.toasty.showSnackBar("error", response?.message);
            }
        });
    }

    /**
     * Get trriger by uniqueName
     *
     * @param {*} uniqueName
     * @memberof SettingCampaignComponent
     */
    public getTriggerByUniqueName(uniqueName: any): void {
        this.campaignIntegrationService.getTriggerByUniqueName(uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            console.log(response);

            this.triggerConditionAction =[];
            if (response?.status === "success") {
                if (this.triggerMode === 'update' || this.triggerMode === 'copy') {
                    this.triggerBccDropdown = [];
                    this.triggerCcDropdown = [];
                    this.triggerToDropdown = [];
                    this.createTrigger.campaignDetails.argsMapping = [];
                    this.createTrigger.campaignDetails.campaignSlug = response?.body?.campaignDetails?.campaignSlug;
                    this.selectCampaign(this.createTrigger.campaignDetails.campaignSlug);
                    this.getFieldsSuggestion(response?.body?.communicationPlatform, response?.body?.condition?.entity);
                    if (response?.body?.campaignDetails?.to || response?.body?.campaignDetails?.bcc || response?.body?.campaignDetails?.cc) {
                        this.triggerToChiplist = response?.body?.campaignDetails?.to;
                        this.triggerBccChiplist = response?.body?.campaignDetails?.bcc;
                        this.triggerCcChiplist = response?.body?.campaignDetails?.cc;
                    } else {
                        this.triggerToChiplist = [];
                        this.triggerBccChiplist = [];
                        this.triggerCcChiplist = [];
                    }

                    this.createTrigger.title = response?.body?.title;
                    this.createTrigger.campaignDetails.sendVoucherPdf = response?.body?.campaignDetails?.sendVoucherPdf;


                    this.getCampaignFields(this.createTrigger.campaignDetails.campaignSlug, () => {
                        this.createTrigger.campaignDetails.argsMapping?.forEach(arg => {
                            const mappedValue = response?.body?.campaignDetails?.argsMapping?.find(argRes => argRes?.name === arg?.name);
                            if (mappedValue) {
                                arg.value = mappedValue?.value;
                            }
                        });
                    });
                    this.tiggerConditionAction = response?.body?.condition?.action[0];
                    this.createTrigger.condition.subConditions.action = response?.body?.condition?.subConditions[0]?.action;
                    this.createTrigger.condition.entity = response?.body?.condition?.entity;
                }
            }
        });
    }

    /**
     * Get campaign fields
     *
     * @param {string} slug
     * @param {Function} [callback]
     * @memberof SettingCampaignComponent
     */
    public getCampaignFields(slug: string, callback?: Function): void {
        this.campaignIntegrationService.getCampaignFields(slug).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.createTrigger.campaignDetails.argsMapping = [];
            if (response?.status === "success") {
                response?.body?.variables?.forEach((result: any) => {
                    this.createTrigger.campaignDetails.argsMapping?.push({
                        name: result,
                        value: ''
                    });
                });

                if (callback) {
                    callback();
                }
            } else {
                this.toasty.showSnackBar("error", response?.message);
            }
        });
    }

    /**
     * Gets campaign list
     *
     * @memberof SettingCampaignComponent
     */
    public getCampaignList(): void {
        this.campaignIntegrationService.getCampaignList().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.campaignList = response?.body?.data?.map((result: any) => {
                    return {
                        value: result?.slug,
                        label: result?.name
                    }
                });
            }
        });
    }

    /**
     * Create New trigger
     *
     * @memberof SettingCampaignComponent
     */
    public createNewTrigger(): void {
        this.createTriggerForm(this.createTrigger);
    }

    /**
     * Update  trigger
     *
     * @memberof SettingCampaignComponent
     */
    public updateTrigger(): void {
        this.updateTriggerForm(this.createTrigger);
    }

    /**
     * Initialize the field
     *
     * @memberof SettingCampaignComponent
     */
    public initFormFields(): void {
        this.createTrigger =
        {
            title: null,
            condition: {
                entity: null,
                action: [],
                subConditions: [
                    {
                        entity: 'voucherType',
                        action: []
                    }
                ]
            },
            communicationPlatform: this.platform,
            campaignDetails: {
                campaignSlug: null,
                argsMapping: [],
                to: [],
                cc: [],
                bcc: [],
                sendVoucherPdf: false
            }
        }
    }

    /**
    * This function will change the page of activity logs
    *
    * @param {*} event
    * @memberof SettingCampaignComponent
    */
    public pageChanged(event: any): void {
        if (this.createTrigger.page !== event?.page) {
            this.createTrigger.page = event?.page;
            this.getTriggers();
        }
    }

    /**
     * This will use for reset communication form
     *
     * @memberof SettingCampaignComponent
     */
    public resetCommunicationForm(): void {
        this.initFormFields();
        this.triggerBccChiplist = [];
        this.triggerToChiplist = [];
        this.triggerCcChiplist = [];
        this.triggerConditionAction = [];
        this.triggerBccDropdown = [];
        this.triggerToDropdown = [];
        this.triggerCcDropdown = [];
    }
    /**
     * This will use for back to list page
     *
     * @param {*} event
     * @memberof SettingCampaignComponent
     */
    public backToListPage(event: any): void {
        if (event) {
            this.showTriggerForm = false;
            this.showVariableMapping = false;
            this.resetCommunicationForm();
            this.triggerMode = 'create';
        }
    }

    /**
     *This will use for select campaign
     *
     * @param {*} slug
     * @param {boolean} [getCampaignFields=false]
     * @memberof SettingCampaignComponent
     */
    public selectCampaign(slug: any, getCampaignFields: boolean = false): void {
        this.createTrigger.campaignDetails.campaignSlug = slug;
        this.showVariableMapping = true;
        if (getCampaignFields) {
            this.getCampaignFields(slug);
        }
    }

    /**
     * This will use for select entity
     *
     * @param {*} entity
     * @memberof SettingCampaignComponent
     */
    public selectEntity(entity: any): void {
        if (entity) {
            this.createTrigger.condition.entity = entity;
        }
    }

    /**
     * This will use for select sub  entity
     *
     * @param {*} entity
     * @memberof SettingCampaignComponent
     */
    public selectSubEntity(subconditions: any): void {
        if (subconditions) {
            this.createTrigger.condition?.subConditions[0]?.action?.push(subconditions);
        }
    }

    /**
 * This will use for select consditions
 *
 * @param {*} entity
 * @memberof SettingCampaignComponent
 */
    public selectConditions(action: any): void {
        console.log(action);

        if (action) {
            this.createTrigger.condition?.action?.push(action);
        }
    }

    /**
 * This will use for select voucher pdf
 *
 * @param {*} entity
 * @memberof SettingCampaignComponent
 */
    public selectVoucherPdf(type: boolean): void {
        this.createTrigger.campaignDetails.sendVoucherPdf = type;
    }

    /**
     * Create Trigger form
     *
     * @param {*} requestObj
     * @memberof SettingCampaignComponent
     */
    public createTriggerForm(requestObj: any): void {
        if (this.triggerMode === 'copy') {
            requestObj.condition.action?.push(this.triggerConditionAction);
            requestObj.campaignDetails.to = this.triggerToChiplist;
            requestObj.campaignDetails.bcc = this.triggerBccChiplist;
            requestObj.campaignDetails.cc = this.triggerCcChiplist;
        }
        requestObj.campaignDetails.argsMapping = requestObj?.campaignDetails?.argsMapping?.filter(val => {
            return val?.value !== "";
        });
        this.campaignIntegrationService.createTrigger(requestObj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasty.showSnackBar("success", response?.body + this.localeData?.communication?.create_trigger_succes);
                this.resetCommunicationForm();
                this.showTriggerForm = false;
                this.getTriggers();
            } else {
                this.toasty.showSnackBar("error", response?.message);
            }
        });
    }

    /**
     * This will use for update trigger form
     *
     * @param {*} requestObj
     * @memberof SettingCampaignComponent
     */
    public updateTriggerForm(requestObj: any): void {
        console.log(requestObj, this.triggerConditionAction);

        requestObj.condition?.action?.push(this.triggerConditionAction);
        requestObj.campaignDetails.to = this.triggerToChiplist;
        requestObj.campaignDetails.bcc = this.triggerBccChiplist;
        requestObj.campaignDetails.cc = this.triggerCcChiplist;
        requestObj.campaignDetails.argsMapping = requestObj?.campaignDetails?.argsMapping?.filter(val => {
            return val?.value !== "";
        });
        this.campaignIntegrationService.updateTrigger(requestObj, this.triggerUniquename).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasty.showSnackBar("success", response?.body);
                this.resetCommunicationForm();
                this.showTriggerForm = false;
                this.getTriggers();
            } else {
                this.toasty.showSnackBar("error", response?.message);
            }
        });
    }

    /**
     * This will use for edit  trigger
     *
     * @param {*} trigger
     * @param {*} mode
     * @memberof SettingCampaignComponent
     */
    public editTrigger(trigger: any, mode: any): void {
        this.triggerMode = mode;
        this.getCampaignList();
        this.getTriggerByUniqueName(trigger?.uniqueName);
        this.showTriggerForm = true;
    }


    /**
     * Deletes the trigger
     *
     * @param {string} triggerUniqueName
     * @memberof SettingCampaignComponent
     */
    public deleteTrigger(triggerUniqueName: string): void {
        let dialogRef = this.dialog?.open(ConfirmModalComponent, {
            width: '40%',
            data: {
                title: this.commonLocaleData?.app_delete,
                body: this.localeData?.communication?.delete_trigger,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef?.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.campaignIntegrationService.deleteTrigger(triggerUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === "success") {
                        this.toasty.showSnackBar("success", response?.body);
                        this.getTriggers();
                    } else {
                        this.toasty.showSnackBar("error", response?.message);
                    }
                });
            }
        });
    }

    /**
     * This will use for trigger activate /deacrtivated events
     *
     * @param {*} uniqueName
     * @memberof SettingCampaignComponent
     */
    public updateTriggerStatus(uniqueName: any): void {
        this.campaignIntegrationService.updateTriggerStatus(this.createTrigger, uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasty.showSnackBar("success", response?.body);
                this.getTriggers();
            } else {
                this.toasty.showSnackBar("error", response?.message);
            }
        });
    }

    /**
     * This will use for toggle trigger form
     *
     * @param {string} [triggerUniqueName]
     * @return {*}  {void}
     * @memberof SettingCampaignComponent
     */
    public toggleTriggerForm(triggerUniqueName?: string): void {
        if (this.showTriggerForm) {
            this.showTriggerForm = false;
            return;
        }
        this.showTriggerForm = true;
        this.showVariableMapping = false;
        this.getCampaignList();
        this.getFieldsSuggestion(this.platform, "VOUCHER");
    }

    /**
     *This wiill use for validation of email
     *
     * @param {string} email
     * @return {*}  {boolean}
     * @memberof SettingCampaignComponent
     */
    public validateEmail(email: string): boolean {
        return this.EMAIL_REGEX_PATTERN.test(String(email)?.toLowerCase());
    }

    /**
     *This wiill use for validation of email
     *
     * @param {string} mobile
     * @return {*}  {boolean}
     * @memberof SettingCampaignComponent
     */
    public validateMobile(mobile: any): boolean {
        return this.MOBILE_REGEX_PATTERN.test(mobile);
    }

    /**
     * This will use for campaign email form
     *
     * @param {string} type
     * @param {*} value
     * @memberof SettingCampaignComponent
     */
    public campaignEmailForm(type: string, value: any): void {
        if (type === "to") {
            this.createTrigger.campaignDetails.to?.push(value);
        }
        if (type === "bcc") {
            this.createTrigger.campaignDetails.bcc?.push(value);
        }
        if (type === "cc") {
            this.createTrigger.campaignDetails.cc?.push(value);
        }
        if (type === 'addTo' && (this.validateEmail(value) || this.validateMobile(value))) {
            this.createTrigger.campaignDetails.to?.push(value);
        }
        if (type === 'addBcc' && this.validateEmail(value)) {
            this.createTrigger.campaignDetails.bcc?.push(value);
        }
        if (type === 'addCc' && this.validateEmail(value)) {
            this.createTrigger.campaignDetails.cc?.push(value);
        }
    }

    /**
     * Add trigger to in chiplist
     *
     * @param {*} event
     * @memberof SettingCampaignComponent
     */
    public addTriggerTo(event: any): void {
        const input = event?.input;
        const value = event?.value;
        if ((value || '')?.trim() && (this.validateEmail(value) || this.validateMobile(value))) {
            this.triggerToChiplist?.push(value);
        }
        if (input) {
            input.value = '';
        }
        this.campaignEmailForm('addTo', value);
    }

    /**
     * Add trigger bcc in chiplist
     *
     * @param {*} event
     * @memberof SettingCampaignComponent
     */
    public addTriggerBcc(event: any) {
        const input = event?.input;
        const value = event?.value;
        if ((value || '')?.trim() && this.validateEmail(value)) {
            this.triggerBccChiplist?.push(value);
        }
        if (input) {
            input.value = '';
        }
        this.campaignEmailForm('addBcc', value);
    }

    /**
     * Add trigger cc in chiplist
     *
     * @param {*} event
     * @memberof SettingCampaignComponent
     */
    public addTriggerCc(event: any) {
        const input = event?.input;
        const value = event?.value;
        if ((value || '')?.trim() && this.validateEmail(value)) {
            this.triggerCcChiplist?.push(value);
        }
        if (input) {
            input.value = '';
        }
        this.campaignEmailForm('addCc', value);
    }

    /**
     * Select trigger Bcc
     *
     * @param {*} event
     * @memberof SettingCampaignComponent
     */
    public selectTriggerBcc(bcc: any): void {
        const selectOptionValue = bcc?.option?.value?.value;
        if (bcc) {
            if (!this.triggerBccChiplist?.includes(selectOptionValue)) {
                this.triggerBccChiplist?.push(selectOptionValue);
            }
        }
        this.campaignEmailForm('bcc', selectOptionValue);
    }

    /**
    * Select trigger Cc
    *
    * @param {*} event
    * @memberof SettingCampaignComponent
    */
    public selectTriggerCc(cc: any): void {
        const selectOptionValue = cc?.option?.value?.value;
        if (cc) {
            if (!this.triggerCcChiplist?.includes(selectOptionValue)) {
                this.triggerCcChiplist?.push(selectOptionValue);
            }
        }
        this.campaignEmailForm('cc', selectOptionValue);
    }

    /**
    * Select trigger To
    *
    * @param {*} event
    * @memberof SettingCampaignComponent
    */
    public selectTriggerTo(to: any): void {
        const selectOptionValue = to?.option?.value?.value;
        if (to) {
            if (!this.triggerToChiplist?.includes(selectOptionValue)) {
                this.triggerToChiplist?.push(selectOptionValue);
            }
        }
        this.campaignEmailForm('to', selectOptionValue);

    }

    /**
   * Remove trigger To
   *
   * @param {*} event
   * @memberof SettingCampaignComponent
   */
    public removeTo(event: any, index: number): void {
        if (index >= 0) {
            this.triggerToChiplist?.splice(index, 1);
        }
    }

    /**
    * Remove trigger Bcc
    *
    * @param {*} event
    * @memberof SettingCampaignComponent
    */
    public removeBcc(event: any, index: number): void {
        if (index >= 0) {
            this.triggerBccChiplist?.splice(index, 1);
        }
    }

    /**
    * Remove trigger Cc
    *
    * @param {*} event
    * @memberof SettingCampaignComponent
    */
    public removeCc(event: any, index: number): void {
        if (index >= 0) {
            this.triggerCcChiplist?.splice(index, 1);
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof SettingCampaignComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            let createUppercase = this.localeData?.communication?.create.toUpperCase();
            let updateUppercase = this.localeData?.communication?.update.toUpperCase();
            let deleteUppercase = this.localeData?.communication?.delete.toUpperCase();
            let voucherUppercase = this.localeData?.communication?.voucher.toUpperCase();
            this.triggerCondition = [
                { label: this.localeData?.communication?.create, value: createUppercase },
                { label: this.localeData?.communication?.update, value: updateUppercase },
                { label: this.localeData?.communication?.delete, value: deleteUppercase }
            ];
            this.triggerEntity = [
                { label: this.localeData?.communication?.voucher, value: voucherUppercase },
            ];
        }
    }

}
