import { Component, OnInit } from "@angular/core";
import { NgxPlaidLinkService, PlaidLinkHandler, LegacyPlaidConfig } from "ngx-plaid-link";
import { SettingsIntegrationService } from "../../services/settings.integraion.service";
import { ReplaySubject, takeUntil } from "rxjs";
import { ToasterService } from "../../services/toaster.service";
import { BROADCAST_CHANNELS } from "../../app.constant";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../store";
import { CommonActions } from "../../actions/common.actions";

@Component({
    selector: "connect-plaid",
    templateUrl: "./connect-plaid.component.html"
})
export class ConnectPlaidComponent implements OnInit {
    /** This will hold plaid link handler */
    private plaidLinkHandler: PlaidLinkHandler;
    /** This will hold plaid configuration */
    private plaidConfig: LegacyPlaidConfig = {
        env: "sandbox",
        token: null,
        product: ["auth", "transactions"],
        onSuccess: undefined,
        onExit: undefined
    };
    /** True if plaid is open */
    private isPlaidOpen: boolean = false;
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private plaidLinkService: NgxPlaidLinkService,
        private settingsIntegrationService: SettingsIntegrationService,
        private toaster: ToasterService,
        private commonAction: CommonActions
    ) {

    }

    /**
     * Lifecycle hook for initialization of component
     *
     * @memberof ConnectPlaidComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.common.reAuthPlaid), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.reauth && !this.isPlaidOpen) {
                this.isPlaidOpen = true;
                this.store.dispatch(this.commonAction.reAuthPlaid({itemId: null, reauth: false}));
                this.getPlaidLinkToken(response?.itemId);
                setTimeout(() => {
                    this.isPlaidOpen = false;
                }, 1000);
            }
        });
    }

    /**
     * This will open create new account modal
     *
     * @memberof ConnectPlaidComponent
     */
    public getPlaidLinkToken(itemId?: any): void {
        this.settingsIntegrationService.getPlaidLinkToken(itemId).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body) {
                this.plaidConfig.token = response.body?.link_token;
                this.plaidLinkService
                    .createPlaid(
                        Object.assign({}, this.plaidConfig, {
                            onSuccess: (token, metadata) => this.getPlaidSuccessPublicToken(token, metadata)
                        })
                    )
                    .then((handler: PlaidLinkHandler) => {
                        this.plaidLinkHandler = handler;
                        this.plaidLinkHandler.open();
                    });
            } else {
                this.toaster.clearAllToaster();
                this.toaster.errorToast(response?.message);
            }
        });
    }

    /**
     * This will use for get plaid success public token
     *
     * @param {*} token
     * @param {*} metadata
     * @memberof ConnectPlaidComponent
     */
    public getPlaidSuccessPublicToken(token: string, metadata: any): void {
        let data = {
            public_token: token,
            institution: metadata?.institution,
            accounts: metadata?.accounts
        }
        this.settingsIntegrationService.savePlaidAccessToken(data).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body) {
                const broadcast = new BroadcastChannel(BROADCAST_CHANNELS.REAUTH_PLAID_SUCCESS);
                broadcast.postMessage(true);
            } else {
                this.toaster.clearAllToaster();
                this.toaster.errorToast(response?.message);
            }
        });
    }
}