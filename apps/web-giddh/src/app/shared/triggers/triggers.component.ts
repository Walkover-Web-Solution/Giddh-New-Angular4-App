import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TemplateFroalaComponent } from "../template-froala/template-froala.component";
import { TriggerComponentStore } from "./uitilty/trigger.store";
import { PAGE_SIZE_OPTIONS } from "../../app.constant";
import { filter, skip, take } from "rxjs";
import { Router } from "@angular/router";
import { CampaignIntegrationService } from "../../services/campaign.integration.service";

@Component({
    selector: 'app-triggers',
    templateUrl: './triggers.component.html',
    styleUrls: ['./triggers.component.scss'],
    providers: [TriggerComponentStore]
})

export class TriggersComponent implements OnInit {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold the loading state */
    public isLoading: boolean = true;

    constructor(
        private dialog: MatDialog,
        private componentStore: TriggerComponentStore,
        private campaignIntegrationService: CampaignIntegrationService,
        private router: Router
    ) { 
        this.componentStore.triggerList$.pipe(skip(1), take(1), filter(Boolean)).subscribe((res) => {
            console.log("Redirect to basic trigger", res);
            if (res?.results?.length) {
                this.router.navigate(["/pages/triggers/basic"]);
            } else {
                this.campaignIntegrationService.getTriggersList({
                    count: 1,
                    page: 1
                }).pipe(filter(Boolean)).subscribe(response => {
                    if (response?.status === "success") {
                        if (response?.body?.items?.length > 0) {
                            this.router.navigate(["/pages/triggers/advance"]);
                        } else {
                            this.isLoading = false;
                        }
                    }
                });
            }
        });
    }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof TriggersComponent
    */
    public ngOnInit(): void {
        this.componentStore.getTriggerList({
            page: 1,
            count: 1,
        });
    }

    /**
    * Opens create trigger dialog
    *
    * @memberof TriggersComponent
    */
    public openCreateTriggerDialog(): void {
        const dialogRef = this.dialog.open(TemplateFroalaComponent, {
            data: { isTrigger: true },
            width: 'var(--aside-pane-width)',
            height: '100vh',
            position: {
                right: '0',
                bottom: '0'
            },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe((response) => {
            if (response) {
                this.router.navigate(["/pages/triggers/basic"]);
            }
        });
    }
}
