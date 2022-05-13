import { KeyValue } from '@angular/common';
import { Component, OnDestroy, Input, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuditLogsActions } from '../../../actions/audit-logs/audit-logs.actions';
import { cloneDeep } from '../../../lodash-optimized';
import { GetAuditLogsRequest } from '../../../models/api-models/Logs';
import { AppState } from '../../../store/roots';

@Component({
    selector: 'activity-logs-table',
    templateUrl: './activity-logs-table.component.html',
    styleUrls: ['activity-logs-table.component.scss']
})
export class ActivityLogsTableComponent implements OnInit {


    constructor(@Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>) {

    }

    public ngOnInit(): void {

    }
}
