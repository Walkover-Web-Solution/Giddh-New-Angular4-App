import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from 'apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component';
import { EMAIL_VALIDATION_REGEX, MOBILE_REGEX_PATTERN, PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { CampaignIntegrationService } from 'apps/web-giddh/src/app/services/campaign.integraion.service';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-select/option.interface';
import { GIDDH_NEW_DATE_FORMAT_UI } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';

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
            value: ''
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
    public createTrigger: any = {};
    /** Holds the communication platform */
    public platform: string = '';
    /** Holds the communication trigger uniquename */
    public triggerUniquename: string = '';
    /** Emit with seperate code for chiplist */
    public separatorKeysCodes: number[] = [ENTER, COMMA];
    /** Holds the trigger to dropdown data */
    public triggerToDropdown: any[] = [];
    /** Holds the trigger bcc dropdown data */
    public triggerBccDropdown: any[] = [];
    /** Holds the trigger cc dropdown data */
    public triggerCcDropdown: any[] = [];
    /** Holds the trigger mobile number dropdown data */
    public triggerMobileDropdown: any[] = [];
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
        count: PAGINATION_LIMIT,
        page: 1,
        totalItems: 0,
        totalPages: 0
    }
    /** True if  the variables showing   */
    public showVariableMapping: boolean = false;
    /** Hold instance of destroyed   */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** True if valid form */
    public disableSubmitButton: boolean = false;
    /** True if valid fields*/
    public mandatoryFields: any = {
        title: false,
        campaignSlug: false,
        triggerToChiplist: false,
        condition: false,
        subConditions: false,
        entity: false,
        authKey: false
    }

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
        this.editCommunicationPlatform = "";
        this.campaignIntegrationService.getCommunicationPlatforms().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.communicationPlatformAuthModel.authFields[0].value = response?.body?.platforms[0]?.fields[0]?.value;
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
        this.mandatoryFields.authKey = false;
        if (!this.communicationPlatformAuthModel.authFields[0].value) {
            this.mandatoryFields.authKey = true;
            this.toasty.showSnackBar("error", this.localeData?.communication?.invalid_key);
            return;
        }
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
            count: PAGINATION_LIMIT,
            page: this.triggerObj.page
        }
        this.campaignIntegrationService.getTriggersList(requestObj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                if (response?.body?.items?.length > 0) {
                    response?.body?.items?.forEach(trigger => {
                        trigger.createdAt = dayjs(trigger.createdAt).format(GIDDH_NEW_DATE_FORMAT_UI);
                        const argsMapping = [];
                        if (trigger?.argsMapping?.length > 0) {
                            trigger?.argsMapping?.forEach(arg => {
                                argsMapping?.push(arg?.name + " -> " + arg?.value);
                            });
                        }

                        this.activeTriggersDataSource.push({ title: trigger?.title, type: trigger?.communicationPlatform, createdAt: trigger?.createdAt, uniqueName: trigger?.uniqueName, argsMapping: argsMapping?.join(", "), isActive: trigger?.isActive });
                        this.triggerObj.totalItems = response.body.totalItems;
                        this.triggerObj.totalPages = response.body.totalPages;
                        this.triggerObj.count = response.body.count;
                    });
                } else {
                    if (response.body?.page > 1) {
                        this.triggerObj.page = response.body.page - 1;
                        this.getTriggers();
                    }
                }
                this.isActiveTriggersLoading = false;
            } else {
                this.toasty.showSnackBar("error", response?.body);
                this.isActiveTriggersLoading = false;
                this.triggerObj.totalItems = 0;
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
                    this.triggerMobileDropdown = response.body?.sendToSuggestions?.map((result: any) => {
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
            if (response?.status === "success") {
                this.triggerBccDropdown = [];
                this.triggerCcDropdown = [];
                this.triggerToDropdown = [];
                this.triggerMobileDropdown = [];
                this.createTrigger.campaignDetails.argsMapping = [];
                this.selectCampaign(this.createTrigger.campaignDetails.campaignSlug);
                this.getFieldsSuggestion(response?.body?.communicationPlatform, response?.body?.condition?.entity);

                this.createTrigger.campaignDetails.to = response?.body?.campaignDetails?.to || [];
                this.createTrigger.campaignDetails.bcc = response?.body?.campaignDetails?.bcc || [];
                this.createTrigger.campaignDetails.cc = response?.body?.campaignDetails?.cc || [];
                this.createTrigger.campaignDetails.mobile = response?.body?.campaignDetails?.mobile || [];
                this.createTrigger.title = response?.body?.title;
                this.createTrigger.campaignDetails.sendVoucherPdf = response?.body?.campaignDetails?.sendVoucherPdf;
                this.createTrigger.campaignDetails.campaignSlug = response?.body?.campaignDetails?.campaignSlug;
                this.createTrigger.campaignDetails.campaignName = response?.body?.campaignDetails?.campaignName;

                this.getCampaignFields(this.createTrigger.campaignDetails.campaignSlug, () => {
                    this.createTrigger.campaignDetails.argsMapping?.forEach(arg => {
                        const mappedValue = response?.body?.campaignDetails?.argsMapping?.find(argRes => argRes?.name === arg?.name);
                        if (mappedValue) {
                            arg.value = mappedValue?.value;
                        }
                    });
                });
                this.createTrigger.condition.action = response?.body?.condition?.action;
                this.createTrigger.condition.subConditions[0].action = response?.body?.condition?.subConditions[0]?.action;
                this.createTrigger.condition.entity = response?.body?.condition?.entity;
            } else {
                this.toasty.showSnackBar("error", response?.message);
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
    * This function will change the page of activity logs
    *
    * @param {*} event
    * @memberof SettingCampaignComponent
    */
    public pageChanged(event: any): void {
        if (this.triggerObj.page !== event?.page) {
            this.triggerObj.page = event?.page;
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
        this.triggerBccDropdown = [];
        this.triggerToDropdown = [];
        this.triggerCcDropdown = [];
        this.triggerMobileDropdown = [];
    }

    /**
     * This will use for back to list page
     *
     * @param {*} event
     * @memberof SettingCampaignComponent
     */
    public backToListPage(event: any): void {
        console.log(event);

        if (event) {
            this.showTriggerForm = false;
            this.showVariableMapping = false;
            this.editCommunicationPlatform = "";
            this.resetCommunicationForm();
            this.triggerMode = 'create';
        }
    }

    /**
 * This will use for back to list page
 *
 * @param {*} event
 * @memberof SettingCampaignComponent
 */
    public backToHomePage(event: any): void {
        if (event) {
            this.editCommunicationPlatform = "";
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
    public selectCampaign(campaign: any, getCampaignFields: boolean = false): void {
        this.createTrigger.campaignDetails.campaignSlug = campaign?.value;
        this.createTrigger.campaignDetails.campaignName = campaign?.label;
        this.showVariableMapping = true;
        if (getCampaignFields) {
            this.getCampaignFields(campaign?.value);
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
    public selectSubEntity(event: any): void {
        this.createTrigger.condition.subConditions[0].action = event;

    }

    /**
     * This will use for select consditions
     *
     * @param {*} entity
     * @memberof SettingCampaignComponent
     */
    public selectConditions(action: any): void {
        if (action) {
            this.createTrigger.condition.action[0] = action;
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
     * Initialize the field
     *
     * @memberof SettingCampaignComponent
     */
    public initFormFields(): void {
        this.createTrigger =
        {
            title: null,
            condition: {
                entity: "Voucher",
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
                campaignName: null,
                argsMapping: [],
                to: [],
                cc: [],
                bcc: [],
                mobile: [],
                sendVoucherPdf: false
            }
        }
    }

    /**
     * Create Trigger form
     *
     * @param {*} requestObj
     * @memberof SettingCampaignComponent
     */
    public createTriggerForm(requestObj: any): void {
        let model = cloneDeep(requestObj);

        if (this.validateTriggerForm()) {
            model.campaignDetails.argsMapping = requestObj?.campaignDetails?.argsMapping?.filter(val => {
                return val?.value !== "";
            });
            this.disableSubmitButton = true;
            this.campaignIntegrationService.createTrigger(model).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.disableSubmitButton = false;
                    this.toasty.showSnackBar("success", this.localeData?.communication?.create_trigger_succes);
                    this.resetCommunicationForm();
                    this.showTriggerForm = false;
                    this.triggerMode = 'create';
                    this.getTriggers();
                } else {
                    this.toasty.showSnackBar("error", response?.message);
                }
            });
        }
    }


    /**
     * This will use for update trigger form
     *
     * @param {*} requestObj
     * @memberof SettingCampaignComponent
     */
    public updateTriggerForm(requestObj: any): void {
        let model = cloneDeep(requestObj);

        if (this.validateTriggerForm()) {
            model.campaignDetails.argsMapping = requestObj?.campaignDetails?.argsMapping?.filter(val => {
                return val?.value !== "";
            });
            this.disableSubmitButton = true;
            this.campaignIntegrationService.updateTrigger(model, this.triggerUniquename).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.disableSubmitButton = false;
                    this.toasty.showSnackBar("success", response?.body);
                    this.resetCommunicationForm();
                    this.showTriggerForm = false;
                    this.triggerMode = 'create';
                    this.getTriggers();
                } else {
                    this.toasty.showSnackBar("error", response?.message);
                }
            });
        }
    }

    /**
     * This will use for reset validation for intialization
     *
     * @memberof SettingCampaignComponent
     */
    public resetValidationErrors(): void {
        this.mandatoryFields.title = false;
        this.mandatoryFields.condition = false;
        this.mandatoryFields.subConditions = false;
        this.mandatoryFields.entity = false;
        this.mandatoryFields.campaignSlug = false;
        this.mandatoryFields.triggerToChiplist = false;
    }

    /**
     * Validate's trigger form
     *
     * @return {*}  {void}
     * @memberof SettingCampaignComponent
     */
    public validateTriggerForm(): boolean {
        this.resetValidationErrors();

        if (!this.createTrigger.title) {
            this.mandatoryFields.title = true;
            this.toasty.showSnackBar("error", this.localeData?.communication?.invalid_title);
            return false;
        }
        if (!this.createTrigger.condition.action[0]) {
            this.mandatoryFields.condition = true;
            this.toasty.showSnackBar("error", this.localeData?.communication?.invalid_action);
            return false;
        }
        if (!this.createTrigger.condition.entity) {
            this.mandatoryFields.entity = true;
            this.toasty.showSnackBar("error", this.localeData?.communication?.invalid_entity);
            return false;
        }
        if (!this.createTrigger.condition.subConditions[0]?.action[0]) {
            this.mandatoryFields.subConditions = true;
            this.toasty.showSnackBar("error", this.localeData?.communication?.invalid_sub_entity);
            return false;
        }
        if (!this.createTrigger.campaignDetails.campaignName) {
            this.mandatoryFields.campaignSlug = true;
            this.toasty.showSnackBar("error", this.localeData?.communication?.invalid_slug);
            return false;
        }
        if (!this.createTrigger.campaignDetails.to?.length) {
            this.mandatoryFields.triggerToChiplist = true;
            this.toasty.showSnackBar("error", this.localeData?.communication?.invalid_to);
            return false;
        }
        return true;
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
        this.showTriggerForm = true;
        this.getCampaignList();
        this.disableSubmitButton = false;
        this.resetValidationErrors();
        this.triggerUniquename = trigger?.uniqueName;
        this.getTriggerByUniqueName(trigger?.uniqueName);
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
     * @return {*}  {void}
     * @memberof SettingCampaignComponent
     */
    public toggleTriggerForm(): void {
        if (this.showTriggerForm) {
            this.showTriggerForm = false;
            return;
        }
        this.resetValidationErrors();
        this.showTriggerForm = true;
        this.showVariableMapping = false;
        this.getCampaignList();
        this.getFieldsSuggestion(this.platform, "VOUCHER");
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
            this.triggerCondition = [
                { label: this.localeData?.communication?.create, value: this.localeData?.communication?.create },
                { label: this.localeData?.communication?.update, value: this.localeData?.communication?.update },
                { label: this.localeData?.communication?.delete, value: this.localeData?.communication?.delete }
            ];
            this.triggerEntity = [
                { label: this.localeData?.communication?.voucher, value: this.localeData?.communication?.voucher },
            ];
        }
    }

    /**
     * This will use for select variables
     *
     * @param {any[]} selectedValues
     * @param {number} index
     * @memberof SettingCampaignComponent
     */
    public selectVariable(selectedValues: any[], index: number): void {
        this.createTrigger.campaignDetails.argsMapping[index].value = selectedValues?.join(",");
    }
}
