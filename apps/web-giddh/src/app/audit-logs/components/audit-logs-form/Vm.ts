import { UserDetails } from '../../../models/api-models/loginModels';
import { CompanyResponse } from '../../../models/api-models/Company';

import * as moment from 'moment/moment';
import { Observable } from 'rxjs';
import { GroupsWithAccountsResponse } from '../../../models/api-models/GroupsWithAccounts';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';

export class AuditLogsSidebarVM {
    public user$: Observable<UserDetails>;
    public accounts$: Observable<IOption[]>;
    public groupsList$: Observable<GroupsWithAccountsResponse[]>;
    public groups$: Observable<IOption[]>;
    public users$: Observable<IOption[]>;
    public moment = moment;
    public maxDate: Date = moment().toDate();
    public filters: IOption[] = [
        // { label: 'All', value: 'All' },
        // { label: 'create', value: 'create' },
        // { label: 'delete', value: 'delete' },
        // { label: 'share', value: 'share' },
        // { label: 'unshare', value: 'unshare' },
        // { label: 'move', value: 'move' },
        // { label: 'merge', value: 'merge' },
        // { label: 'unmerge', value: 'unmerge' },
        // { label: 'delete-all', value: 'delete-all' },
        // { label: 'update', value: 'update' },
        // { label: 'master-import', value: 'master-import' },
        // { label: 'daybook-import', value: 'daybook-import' },
        // { label: 'ledger-excel-import', value: 'ledger-excel-import' }
    ];
    public entities: IOption[] = [
        // { label: 'All', value: 'All' },
        // { label: 'company', value: 'company' },
        // { label: 'group', value: 'group' },
        // { label: 'account', value: 'account' },
        // { label: 'ledger', value: 'ledger' },
        // { label: 'voucher', value: 'voucher' },
        // { label: 'logs', value: 'logs' },
        // { label: 'invoice', value: 'invoice' },
    ];
    public getLogsInprocess$: Observable<boolean>;
    public dateOptions: IOption[] = [{ label: 'Date Range', value: '1' }, { label: 'Entry/Log Date', value: '0' }];
    public showLogDatePicker: boolean = false;
    public canManageCompany: boolean = false;
    public selectedOperation: string = '';
    public selectedEntity: string = '';
    public selectedUserUnq: string = '';
    public selectedAccountUnq: string = '';
    public selectedGroupUnq: string = '';
    public selectedFromDate: Date;
    public selectedToDate: Date;
    public selectedLogDate: Date;
    public selectedEntryDate: Date;
    public logOrEntry: string = 'entryDate';
    public selectedDateOption: string = '0';

    public reset() {
        this.showLogDatePicker = false;
        this.canManageCompany = false;
        this.selectedOperation = '';
        this.selectedEntity = '';
        this.selectedUserUnq = '';
        this.selectedAccountUnq = '';
        this.selectedGroupUnq = '';
        this.selectedFromDate = moment().toDate();
        this.selectedToDate = moment().toDate();
        this.selectedLogDate = moment().toDate();
        this.selectedEntryDate = moment().toDate();
        this.logOrEntry = 'entryDate';
        this.selectedDateOption = '';

    }

    /** used for testing purpose we will remove it in next build */
    public getJSON() {
        return {
            "status": "success",
            "body": {
                "page": 1,
                "count": 50,
                "totalPages": 1,
                "totalItems": 9,
                "results": [
                    {
                        "operationType": "MOVE",
                        "user": {
                            "name": "Aditya Kumar Chandeliya",
                            "uniqueName": "adityakumar@giddh.com",
                            "email": "adityakumar@giddh.com",
                            "isVerified": true
                        },
                        "date": 1594365582160,
                        "dateString": "10-07-2020 12:49:42",
                        "details": {
                            "source": {
                                "name": "G1",
                                "uniqueName": "g1",
                                "id": null
                            },
                            "target": {
                                "name": "G2",
                                "uniqueName": "g2",
                                "id": null
                            },
                            "entity": {
                                "name": "Account 1",
                                "uniqueName": "account1",
                                "group": {
                                    "name": "G2",
                                    "uniqueName": "g2",
                                    "id": 312
                                },
                                "bankDetails": null,
                                "addresses": [
                                    {
                                        "address": "",
                                        "gstIn": "",
                                        "state": {
                                            "name": "Himachal Pradesh",
                                            "code": "HP",
                                            "alias": null
                                        },
                                        "country": {
                                            "countryName": "India",
                                            "countryCode": "IN"
                                        }
                                    }
                                ],
                                "old": null
                            },
                            "searchableIds": null,
                            "type": null
                        }
                    },
                    {
                        "operationType": "UNMERGE",
                        "user": {
                            "name": "Aditya Kumar Chandeliya",
                            "uniqueName": "adityakumar@giddh.com",
                            "email": "adityakumar@giddh.com",
                            "isVerified": true
                        },
                        "date": 1594365565618,
                        "dateString": "10-07-2020 12:49:25",
                        "details": {
                            "type": "DELETE",
                            "source": {
                                "name": "Account 1",
                                "uniqueName": "account1",
                                "id": 180
                            },
                            "entity": {
                                "name": "Account 2",
                                "uniqueName": "1594365565351a73efnupucnvnhklsrrfalr4x120mm4tz76f2yhk",
                                "group": {
                                    "name": "G1",
                                    "uniqueName": "g1",
                                    "id": 307
                                },
                                "bankDetails": null,
                                "addresses": [
                                    {
                                        "address": "some address 1",
                                        "gstIn": "",
                                        "state": {
                                            "name": "Himachal Pradesh",
                                            "code": "HP",
                                            "alias": null
                                        },
                                        "country": {
                                            "countryName": "India",
                                            "countryCode": "IN"
                                        }
                                    },
                                    {
                                        "address": "some second address",
                                        "gstIn": "",
                                        "state": {
                                            "name": "Himachal Pradesh",
                                            "code": "HP",
                                            "alias": null
                                        },
                                        "country": {
                                            "countryName": "India",
                                            "countryCode": "IN"
                                        }
                                    }
                                ],
                                "old": null
                            },
                            "searchableIds": [
                                181,
                                180
                            ]
                        }
                    },
                    {
                        "operationType": "MERGE",
                        "user": {
                            "name": "Aditya Kumar Chandeliya",
                            "uniqueName": "adityakumar@giddh.com",
                            "email": "adityakumar@giddh.com",
                            "isVerified": true
                        },
                        "date": 1594365120695,
                        "dateString": "10-07-2020 12:42:00",
                        "details": {
                            "source": [
                                {
                                    "name": "Account 2",
                                    "uniqueName": "account2",
                                    "id": 181
                                },
                                {
                                    "name": "Account 3",
                                    "uniqueName": "account3",
                                    "id": 182
                                }
                            ],
                            "target": {
                                "name": "Account 1",
                                "uniqueName": "account1",
                                "id": 180
                            },
                            "type": "TARGET",
                            "searchableIds": [
                                181,
                                182,
                                180
                            ]
                        }
                    },
                    {
                        "operationType": "CREATE",
                        "user": {
                            "name": "Aditya Kumar Chandeliya",
                            "uniqueName": "adityakumar@giddh.com",
                            "email": "adityakumar@giddh.com",
                            "isVerified": true
                        },
                        "date": 1594364983701,
                        "dateString": "10-07-2020 12:39:43",
                        "details": {
                            "name": "Account 4",
                            "uniqueName": "account4",
                            "group": {
                                "name": "G1",
                                "uniqueName": "g1",
                                "id": 307
                            },
                            "bankDetails": null,
                            "addresses": [
                                {
                                    "address": "",
                                    "gstIn": "",
                                    "state": {
                                        "name": "Himachal Pradesh",
                                        "code": "HP",
                                        "alias": null
                                    },
                                    "country": {
                                        "countryName": "India",
                                        "countryCode": "IN"
                                    }
                                }
                            ],
                            "old": null
                        }
                    },
                ],
                "size": 9,
                "fromDate": null,
                "toDate": null,
                "openingBalance": {
                    "amount": 0.0000,
                    "type": "DEBIT"
                },
                "closingBalance": {
                    "amount": 0.0000,
                    "type": "DEBIT"
                },
                "debitTotal": 0,
                "creditTotal": 0
            }
        };
    }
}
