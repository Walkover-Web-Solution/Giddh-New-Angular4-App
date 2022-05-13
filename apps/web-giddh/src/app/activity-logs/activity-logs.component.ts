import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GIDDH_NEW_DATE_FORMAT_UI, GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { GeneralService } from '../services/general.service';
import { ActivityLogsFormComponent } from './components/activity-logs-form/activity-logs-form.component';
import { GetAuditLogsRequest } from '../models/api-models/Logs';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../app.constant';
import { KeyValue } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivityLogsTableComponent } from './components/activity-logs-table/activity-logs-table.component';
@Component({
    selector: 'activity-logs',
    templateUrl: './activity-logs.component.html',
    styleUrls: [`./activity-logs.component.scss`],
})
export class ActivityLogsComponent implements OnInit, OnDestroy {
     private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    public results =
        [
            {
                "operationType": "CREATE",
                "user": {
                    "name": "Kriti Jain",
                    "uniqueName": "kriti@giddh.com",
                    "email": "kriti@giddh.com",
                    "mobile": "919479575256",
                    "isVerified": true
                },
                "date": 1649918740953,
                "dateString": "14-04-2022 06:45:40",
                "details": {
                    "uniqueName": "3jr1649918740457",
                    "entryDate": [
                        2022,
                        4,
                        14,
                        0,
                        0,
                        0,
                        0
                    ],
                    "entryDateString": "14-04-2022",
                    "baseAccount": {
                        "name": "test5",
                        "uniqueName": "test5",
                        "id": 2166950
                    },
                    "subTotal": "2",
                    "total": "2",
                    "taxTotal": "0",
                    "otherAccounts": [
                        {
                            "name": "test5",
                            "uniqueName": "test5",
                            "id": 2166950
                        },
                        {
                            "name": "Cash",
                            "uniqueName": "cash",
                            "id": 2165992
                        }
                    ],
                    "description": "",
                    "voucher": "receipt",
                    "hasAttachment": false
                }
            },
            {
                "operationType": "EDIT",
                "user": {
                    "name": "Kriti Jain",
                    "uniqueName": "kriti@giddh.com",
                    "email": "kriti@giddh.com",
                    "mobile": "919479575256",
                    "isVerified": true
                },
                "date": 1652256907794,
                "dateString": "11-05-2022 08:15:07",
                "details": {
                    "name": "d1",
                    "uniqueName": "d1",
                    "stockGroup": {
                        "name": "demo",
                        "uniqueName": "demo",
                        "id": 53196
                    },
                    "stockUnit": {
                        "name": "Number",
                        "code": "nos"
                    },
                    "purchases": null,
                    "sales": null
                },
                "old": {
                    "operationType": "EDIT",
                    "user": {
                        "name": "Kriti Jain",
                        "uniqueName": "kriti@giddh.com",
                        "email": "kriti@giddh.com",
                        "mobile": "919479575256",
                        "isVerified": true
                    },
                    "date": 1652256899151,
                    "dateString": "11-05-2022 08:14:59",
                    "details": {
                        "name": "d1",
                        "uniqueName": "d1",
                        "stockGroup": {
                            "name": "demo",
                            "uniqueName": "demo",
                            "id": 53196
                        },
                        "stockUnit": {
                            "name": "Number",
                            "code": "nos"
                        },
                        "purchases": null,
                        "sales": null
                    }
                }
            },
            {
                "operationType": "CREATE",
                "user": {
                    "name": "Kriti Jain",
                    "uniqueName": "kriti@giddh.com",
                    "email": "kriti@giddh.com",
                    "mobile": "919479575256",
                    "isVerified": true
                },
                "date": 1652436240732,
                "dateString": "13-05-2022 10:04:00",
                "details": {
                    "uniqueName": "bpf1652436240241",
                    "entryDate": [
                        2022,
                        5,
                        13,
                        0,
                        0,
                        0,
                        0
                    ],
                    "entryDateString": "13-05-2022",
                    "baseAccount": {
                        "name": "PhonePay",
                        "uniqueName": "phonepay",
                        "id": 3352446
                    },
                    "subTotal": "88",
                    "total": "88",
                    "taxTotal": "0",
                    "otherAccounts": [
                        {
                            "name": "Demo Banck",
                            "uniqueName": "demobanck",
                            "id": 3352449
                        },
                        {
                            "name": "PhonePay",
                            "uniqueName": "phonepay",
                            "id": 3352446
                        }
                    ],
                    "description": null,
                    "voucher": "contra",
                    "hasAttachment": false
                }
            },
            {
                "operationType": "EDIT",
                "user": {
                    "name": "Kriti Jain",
                    "uniqueName": "kriti@giddh.com",
                    "email": "kriti@giddh.com",
                    "mobile": "919479575256",
                    "isVerified": true
                },
                "date": 1651837660725,
                "dateString": "06-05-2022 11:47:40",
                "details": {
                    "name": "hardik  ",
                    "uniqueName": "hardik",
                    "group": {
                        "name": "Sundry Debtors",
                        "uniqueName": "sundrydebtors",
                        "id": 314121
                    },
                    "bankDetails": null,
                    "addresses": [
                        {
                            "address": " ",
                            "gstIn": "",
                            "state": {
                                "name": "Haryana",
                                "code": "HR",
                                "alias": null,
                                "pincode": null
                            },
                            "country": {
                                "countryName": "India",
                                "countryCode": "IN"
                            },
                            "default": true
                        }
                    ]
                }
            }];

    public originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
        return 0;
    }

    public reverseKeyOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
        return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
    }

    public valueOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
        return a.value.localeCompare(b.value);
    }

    public showJson: boolean = false;
    constructor(public dialog: MatDialog) {

    }

    public openDialog() {
        this.dialog.open(ActivityLogsTableComponent, {
            data: {
                json: this.results,
            },
            width: '50%'
        });
    }

    public ngOnInit(): void {
        
    }
    
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
