import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TemplateFroalaComponent } from "../template-froala/template-froala.component";
import { TriggerComponentStore } from "./uitilty/trigger.store";
import { filter, skip, take } from "rxjs";
import { Router } from "@angular/router";
import { ASIDE_PANE_CONFIG } from "../../app.constant";

/**
 * Handles Component functionality
 */
@Component({
    selector: 'app-triggers',
    templateUrl: './triggers.component.html',
    styleUrls: ['./triggers.component.scss'],
    providers: [TriggerComponentStore],
    standalone: false
})

/**
 * TriggersComponent component
 * Handles triggers functionality and user interactions
 */
export class TriggersComponent implements OnInit {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold the loading state */
    public isLoading: boolean = true;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private dialog: MatDialog,
        private componentStore: TriggerComponentStore,
        private router: Router
    ) { 
        this.componentStore.triggerList$.pipe(skip(1), filter(Boolean), take(1)).subscribe((res) => {
            /**
             * Handles if functionality
             */
            if (res?.results?.length) {
                this.router.navigate(["/pages/settings/trigger/basic"]);
            } else {
                this.componentStore.triggerAdvanceList$.pipe(skip(1), filter(Boolean), take(1)).subscribe((res) => {
                    /**
                     * Handles if functionality
                     */
                    if (res?.items?.length) {
                        this.router.navigate(["/pages/settings/trigger/advance"]);
                    } else {
                        this.isLoading = false;
                    }
                });
                this.componentStore.getTriggerAdvanceList({ 
                    page: 1,
                    count: 1
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
            count: 1
        });
    }

    /**
    * Opens create trigger dialog
    *
    * @memberof TriggersComponent
    */
    public openCreateTriggerDialog(): void {
        const dialogRef = this.dialog.open(TemplateFroalaComponent, {
            ...ASIDE_PANE_CONFIG,
            data: { isTrigger: true }
        });
        dialogRef.afterClosed().subscribe((response) => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.router.navigate(["/pages/settings/trigger/basic"]);
            }
        });
    }
}
