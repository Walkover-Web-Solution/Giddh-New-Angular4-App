import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Observable, ReplaySubject, takeUntil } from "rxjs";
import * as dayjs from 'dayjs';
import { select, Store } from "@ngrx/store";
import { GeneralService } from "../../services/general.service";
import { AppState } from "../../store";
import { GIDDH_NEW_DATE_FORMAT_UI } from "../helpers/defaultDateFormat";
import { MatDialog } from "@angular/material/dialog";

export interface TableData {
    title: string;
    entity: string;
    entityUniqueNames: string[];
    voucherTypes: string[];
    emailSubject: string;
    triggerModule: string;
    to: string[];
    cc: string[];
    bcc: string[];
    conditions: {
        DUE_BY: { key: string; value: number };
        DUE_AMOUNT: { key: string; value: number };
    };
    executionTime: {
        time: string;
        dayOfWeek?: string;
        dayOfMonth?: string;
    };
    actions: string[];
    html: string;
    disabled: boolean;
}

@Component({
    selector: 'app-triggers',
    templateUrl: './triggers.component.html',
    styleUrls: ['./triggers.component.scss']
})

export class TriggersComponent implements OnInit {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(private dialog: MatDialog
    ) {
    }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof TriggersComponent
    */
    public ngOnInit(): void {
     
    }

    /**
    * Opens create trigger dialog
    *
    * @memberof TriggersComponent
    */
    public openCreateTriggerDialog() {
        // this.dialog.open
    }
}
