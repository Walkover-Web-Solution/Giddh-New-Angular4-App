import { take } from 'rxjs/operators';
import { IAccountsInfo } from '../../../../models/interfaces/accountInfo.interface';
import { IGroupsWithAccounts } from '../../../../models/interfaces/groupsWithAccounts.interface';
import { INameUniqueName } from '../../../../models/api-models/Inventory';
import { eventsConst } from 'apps/web-giddh/src/app/shared/header/components/eventsConst';
import { GroupCreateRequest, GroupResponse, GroupUpateRequest } from 'apps/web-giddh/src/app/models/api-models/Group';
import { BaseResponse } from 'apps/web-giddh/src/app/models/api-models/BaseResponse';
import { GroupsWithAccountsResponse } from 'apps/web-giddh/src/app/models/api-models/GroupsWithAccounts';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Store, select } from '@ngrx/store';
import { AccountRequestV2, AccountResponseV2 } from 'apps/web-giddh/src/app/models/api-models/Account';
import { cloneDeep, sortBy } from 'apps/web-giddh/src/app/lodash-optimized';

export class GroupAccountSidebarVM {
    public columns: ColumnGroupsAccountVM[];
    public parentIndex: number;
    public currentIndex: number;
    public selectedType: string;
    public grpCategory: string;
    public selectedGrp: ColumnGroupsAccountVM;
    public keyWord: string;

    constructor(private store: Store<AppState>) {

    }

    public selectGroup(item: IGroupsWithAccounts, currentIndex: number, isSearching: boolean = false) {
        this.columns.splice(currentIndex + 1, this.columns?.length - currentIndex + 1);
        if (item.groups) {
            item.groups = sortBy(item.groups, ['uniqueName', 'name']);
        }
        if (item.accounts) {
            item.accounts = sortBy(item.accounts, ['uniqueName', 'name']);
        }
        if (item.groups || item.accounts) {
            this.columns.push(new ColumnGroupsAccountVM(item));
        }

        if (isSearching) {
            let colLength = this.columns?.length;
            this.columns[colLength - 1].IsCreateNewBtnShowable = true;
        }
    }

    public handleEvents(eventType: eventsConst, payload: any) {
        let columnLength = this.columns?.length;
        switch (eventType) {
            /**
             * group operations
             */
            case eventsConst.groupAdded: {
                let resp: BaseResponse<GroupResponse, GroupCreateRequest> = payload;
                let grp: IGroupOrAccount = {
                    accounts: [],
                    groups: [],
                    isGroup: true,
                    name: resp.body.name,
                    uniqueName: resp.body.uniqueName,
                    isVisible: true
                };
                let Items = cloneDeep(this.columns[columnLength - 1].Items);
                Items.push(grp);
                this.columns[columnLength - 1].Items = Items;
                break;
            }

            case eventsConst.groupUpdated: {
                let resp: BaseResponse<GroupResponse, GroupUpateRequest> = payload;
                let Items = cloneDeep(this.columns[columnLength - 2].Items);
                this.columns[columnLength - 2].Items = Items.map(p => {
                    if (p.uniqueName === resp.queryString?.groupUniqueName) {
                        p = {
                            ...p,
                            name: resp.body.name,
                            uniqueName: resp.body.uniqueName
                        };
                    }
                    return p;
                });
                break;
            }

            case eventsConst.groupDeleted: {
                let resp: BaseResponse<string, string> = payload;
                this.columns.pop();
                for (let colIndex = 0; colIndex < this.columns?.length; colIndex++) {
                    let col = this.columns[colIndex];
                    let itemIndex = col.Items.findIndex(f => f.uniqueName === resp.queryString.parentUniqueName);
                    if (itemIndex > -1) {
                        // remove all columns first
                        this.columns.splice(colIndex, this.columns?.length);
                        let fCol = col;

                        // add new parent column of finded item
                        this.columns.push(new ColumnGroupsAccountVM(fCol as IGroupsWithAccounts));
                        let newCol = fCol.Items.find(j => j.uniqueName === resp.queryString.parentUniqueName);
                        let grpsBck: GroupsWithAccountsResponse[];
                        this.store.pipe(select(s => s.general.groupswithaccounts), take(1)).subscribe(s => grpsBck = s);

                        let listBckup = this.activeGroupFromGroupListBackup(grpsBck, resp.queryString.parentUniqueName, null);
                        if (listBckup) {
                            newCol.groups = listBckup.groups;
                            newCol.accounts = listBckup.accounts;
                        }
                        // add sub column of last added column
                        this.columns.push(new ColumnGroupsAccountVM(newCol as IGroupsWithAccounts));
                        return;
                    }
                }
                break;
            }

            case eventsConst.groupMoved: {
                break;
            }

            /**
             * account operations
             */
            case eventsConst.accountAdded: {
                let resp: BaseResponse<AccountResponseV2, AccountRequestV2> = payload;
                let Items = cloneDeep(this.columns[columnLength - 1].Items);
                let acc: IGroupOrAccount = {
                    accounts: [],
                    groups: [],
                    isGroup: false,
                    name: resp.body.name,
                    uniqueName: resp.body.uniqueName,
                    isVisible: true
                };
                Items.push(acc);
                this.columns[columnLength - 1].Items = Items;
                break;
            }

            case eventsConst.accountUpdated: {
                let resp: BaseResponse<AccountResponseV2, AccountRequestV2> = payload;
                let Items = cloneDeep(this.columns[columnLength - 1].Items);
                this.columns[columnLength - 1].Items = Items.map(p => {
                    if (p.uniqueName === resp.queryString.accountUniqueName) {
                        p = {
                            ...p,
                            name: resp.body.name,
                            uniqueName: resp.body.uniqueName
                        };
                    }
                    return p;
                });
                break;
            }

            case eventsConst.accountDeleted: {
                let resp: BaseResponse<string, any> = payload;
                let columnsLength = this.columns?.length;
                this.columns[columnsLength - 1].Items = this.columns[columnsLength - 1].Items?.filter(f => f.uniqueName !== resp.request.accountUniqueName);
                this.columns[columnsLength - 2].accounts = this.columns[columnsLength - 1].accounts?.filter(f => f.uniqueName !== resp.request.accountUniqueName);
            }

            case eventsConst.accountMoved: {
                break;
            }

            default:
                break;
        }
    }

    public activeGroupFromGroupListBackup(groups: GroupsWithAccountsResponse[], uniqueName: string, result: GroupsWithAccountsResponse) {
        if(groups?.length > 0) {
            for (let grp of groups) {
                if (grp?.uniqueName === uniqueName) {
                    result = grp;
                    return result;
                }

                if (grp?.groups) {
                    result = this.activeGroupFromGroupListBackup(grp?.groups, uniqueName, result);
                    if (result) {
                        return result;
                    }
                }
            }
        }
    }
}

export class ColumnGroupsAccountVM implements IGroupsWithAccounts {
    public synonyms: string;
    public accounts: IAccountsInfo[];
    public name: string;
    public uniqueName: string;
    public category: string;
    public isActive: boolean;
    public isOpen: boolean;
    public isVisible: boolean = true;
    public groups: IGroupsWithAccounts[];
    public hLevel: number;
    public Items: IGroupOrAccount[];
    public SelectedItem: IGroupOrAccount;
    public IsCreateNewBtnShowable: boolean = false;

    // tslint:disable-next-line:no-empty
    constructor(grp: IGroupsWithAccounts) {
        if (grp) {
            this.accounts = grp.accounts;
            this.synonyms = grp.synonyms;
            this.name = grp.name;
            this.uniqueName = grp.uniqueName;
            this.category = grp.category;
            this.isActive = grp.isActive;
            this.isOpen = grp.isOpen;
            this.isVisible = grp.isVisible;
            this.groups = grp.groups;
            let grps = this.groups || [];
            let accs = this.accounts || [];
            let grps2 = grps.map(p => ({ ...p, isGroup: true } as IGroupOrAccount));
            let accs2 = accs.map(p => ({ ...p, isGroup: false } as IGroupOrAccount));

            this.Items = [...grps2, ...accs2] as IGroupOrAccount[];
        }
    }

}

export interface IGroupOrAccount extends INameUniqueName {
    isGroup: boolean;
    // Groups prop
    synonyms?: string;
    accounts?: IAccountsInfo[];
    category?: string;
    groups?: IGroupsWithAccounts[];
    isActive?: boolean;
    isOpen?: boolean;
    isVisible?: boolean;
    // accounts prop
    stocks?: any[];
    mergedAccounts?: string;
}
