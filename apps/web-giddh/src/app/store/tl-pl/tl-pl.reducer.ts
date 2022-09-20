import { TBPlBsActions } from '../../actions/tl-pl.actions';
import { AccountDetails, BalanceSheetData, GetCogsResponse, ProfitLossData } from '../../models/api-models/tb-pl-bs';
import { ChildGroup } from '../../models/api-models/Search';
import { CustomActions } from '../customActions';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { cloneDeep, each, reject } from '../../lodash-optimized';

interface TbState {
    data?: AccountDetails;
    exportData: ChildGroup[];
    count: 0;
    detailedGroups: any;
    showLoader: boolean;
    noData: boolean;
}

interface PlState {
    data?: ProfitLossData;
    exportData: any;
    showLoader: boolean;
    noData: boolean;
    cogs: GetCogsResponse;
}

interface BsState {
    data?: BalanceSheetData;
    exportData: any;
    showLoader: boolean;
    noData: boolean;
}

export interface TBPlBsState {
    tb?: TbState;
    pl?: PlState;
    bs?: BsState;
}

export const initialState: TBPlBsState = {
    tb: {
        data: null,
        noData: true,
        showLoader: false,
        exportData: [],
        count: 0,
        detailedGroups: [],
    },
    pl: {
        data: null,
        noData: true,
        showLoader: false,
        exportData: [],
        cogs: new GetCogsResponse()
    },
    bs: {
        data: null,
        noData: true,
        showLoader: false,
        exportData: [],
    }
};

export function tbPlBsReducer(state = initialState, action: CustomActions): TBPlBsState {
    switch (action.type) {
        case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
            return Object.assign({}, state, initialState);
        }
        case TBPlBsActions.GET_TRIAL_BALANCE_RESPONSE:
        case TBPlBsActions.GET_V2_TRIAL_BALANCE_RESPONSE: {
            // no payload means error from server
            if (action.payload) {
                let data: AccountDetails = cloneDeep(action.payload) as AccountDetails;
                data.groupDetails = removeZeroAmountAccount((data.groupDetails));
                let noData = false;
                let showLoader = false;
                if (data.closingBalance.amount === 0 && data.creditTotal === 0 && data.debitTotal === 0 && data.forwardedBalance.amount === 0) {
                    noData = true;
                }
                return {
                    ...state,
                    tb: { ...state.tb, data, noData, showLoader, exportData: data.groupDetails }
                };
            } else {
                return { ...state, tb: { ...state.tb, showLoader: false, exportData: [], data: null, noData: true } };
            }
        }
        case TBPlBsActions.GET_TRIAL_BALANCE_REQUEST:
        case TBPlBsActions.GET_V2_TRIAL_BALANCE_REQUEST: {
            return { ...state, tb: { ...state.tb, showLoader: true } };
        }

        case TBPlBsActions.GET_PROFIT_LOSS_RESPONSE: {

            let data: ProfitLossData = prepareProfitLossData(cloneDeep(action.payload));
            if (data) {
                if (state && state.pl && state.pl.data) {
                    data.dates = cloneDeep(state.pl.data.dates);
                }
                addVisibleFlag(data.incArr);
                addVisibleFlag(data.expArr);
                return { ...state, pl: { ...state.pl, showLoader: false, data: { ...state.pl.data, ...data } } };
            } else {
                return { ...state, pl: { ...state.pl, showLoader: false, data: null } };
            }
        }

        case TBPlBsActions.GET_PROFIT_LOSS_REQUEST: {
            let from = action.payload.from;
            let to = action.payload.to;
            return {
                ...state,
                pl: { ...state.pl, showLoader: true, data: { ...state.pl.data, dates: { from, to } } }
            };
        }

        case TBPlBsActions.GET_COGS_RESPONSE: {
            return {
                ...state,
                pl: { ...state.pl, cogs: action.payload }
            };
        }

        case TBPlBsActions.GET_BALANCE_SHEET_RESPONSE: {
            let data: BalanceSheetData = prepareBalanceSheetData(cloneDeep(action.payload));
            if (data) {
                if (state?.bs?.data) {
                    data.dates = cloneDeep(state.bs.data.dates);
                }
                addVisibleFlag(data.assets);
                addVisibleFlag(data.liabilities);
                return { ...state, bs: { ...state.bs, showLoader: false, data: { ...state.bs.data, ...data } } };
            } else {
                return { ...state, bs: { ...state.bs, showLoader: false, data: null } };
            }
        }

        case TBPlBsActions.GET_BALANCE_SHEET_REQUEST: {
            let from = action.payload.from;
            let to = action.payload.to;
            return {
                ...state,
                bs: { ...state.bs, showLoader: true, data: { ...state.bs.data, dates: { from, to } } }
            };
        }
        default: {
            return state;
        }
    }
}

// TB Functions
const removeZeroAmountAccount = (grpList: ChildGroup[]) => {
    each(grpList, (grp) => {
        let count = 0;
        let tempAcc = [];
        if (grp.closingBalance.amount > 0 || grp.forwardedBalance.amount > 0 || grp.creditTotal > 0 || grp.debitTotal > 0) {
            each(grp.accounts, (account) => {
                if (account.closingBalance.amount > 0 || account.openingBalance.amount > 0 || account.creditTotal > 0 || account.debitTotal > 0) {
                    return tempAcc.push(account);
                } else {
                    return count = count + 1;
                }
            });
        }
        if (tempAcc?.length > 0) {
            grp.accounts = tempAcc;
        }
        if (grp.childGroups?.length > 0) {
            return removeZeroAmountAccount(grp.childGroups);
        }
    });

    return grpList;
};

// TB Functions
const addVisibleFlag = (grpList: ChildGroup[]) => {
    each(grpList, (grp) => {
        let tempAcc = [];
        grp.isVisible = false;
        each(grp.accounts, (account) => {
            account.isVisible = false;
        });

        if (tempAcc?.length > 0) {
            grp.accounts = tempAcc;
        }
        if (grp.childGroups?.length > 0) {
            return addVisibleFlag(grp.childGroups);
        }
    });
    return grpList;
};

const removeZeroAmountGroup = (grpList) => {
    return each(grpList, (grp: any) => {
        if (grp.childGroups?.length > 0) {
            removeZeroAmountGroup(grp.childGroups);
        }
        return reject(grp.childGroups, (cGrp) => {
            
        });
    });
};

// PL Functions

const filterProfitLossData = (data, statement) => {
    let filterPlData: ProfitLossData = {};
    let incomeStatement = statement;
    filterPlData.incArr = [];
    filterPlData.expArr = [];
    filterPlData.othArr = [];
    let revenueGroup: any = revenueParentGrp(new ParentGrp(), incomeStatement.revenue);
    let operatingGrp: any = operatingExpParentGrp(new ParentGrp(), incomeStatement.operatingExpenses);
    let otherExpGrp: any = otherExpParentGrp(new ParentGrp(), incomeStatement.otherExpenses);

    each(data, (grp: any, idx) => {
        grp.isVisible = false;
        switch (grp.category) {
            case 'income':
                if (idx === 0) {
                    filterPlData.incArr.push(revenueGroup);
                }
                return filterPlData.incArr[0].childGroups.push(grp);
            case 'expenses':
                if (grp?.uniqueName === 'operatingcost') {
                    filterPlData.expArr.push(operatingGrp);
                    return filterPlData.expArr[0].childGroups.push(grp);
                } else {
                    filterPlData.expArr.push(otherExpGrp);
                    return filterPlData.expArr[1].childGroups.push(grp);
                }
            default:
                return filterPlData.othArr.push(grp);
        }
    });
    return filterPlData;
};

const prepareProfitLossData = (data) => {
    if (data && data.groupInfo && data.groupInfo.groupDetails && data.incomeStatment) {
        let plData: ProfitLossData = filterProfitLossData(data.groupInfo.groupDetails, data.incomeStatment);
        plData.expenseTotal = calculateTotalExpense(plData.expArr);
        plData.expenseTotalEnd = calculateTotalExpenseEnd(plData.expArr);
        plData.incomeTotal = calculateTotalIncome(plData.incArr);
        plData.incomeTotalEnd = calculateTotalIncomeEnd(plData.incArr);
        plData.closingBalance = Math.abs(plData.incomeTotal - plData.expenseTotal);
        plData.frowardBalance = Math.abs(plData.incomeTotalEnd - plData.expenseTotalEnd);
        plData.incomeStatment = data.incomeStatment;
        if (plData.incomeTotal >= plData.expenseTotal) {
            plData.inProfit = true;
        }
        if (plData.incomeTotal < plData.expenseTotal) {
            plData.inProfit = false;
        }
        if (data.closingBalance.type === 'CREDIT') {
            plData.closingBalanceClass = true;
        } else {
            plData.closingBalanceClass = false;
        }
        if (data.forwardedBalance.type === 'CREDIT') {
            plData.frowardBalanceClass = true;
        } else {
            plData.frowardBalanceClass = false;
        }
        plData.message = data.message;
        return plData;
    }

    return;
};

const calculateTotalIncome = data => {
    let eTtl;
    eTtl = 0;
    each(data, (item: any) => {
        if (item.closingBalance.type === 'DEBIT') {
            return eTtl -= Number(item.closingBalance.amount);
        } else {
            return eTtl += Number(item.closingBalance.amount);
        }
    });
    return Number(eTtl.toFixed(2));
};
const calculateTotalIncomeEnd = data => {
    let eTtl;
    eTtl = 0;
    each(data, (item: any) => {
        if (item.forwardedBalance.type === 'DEBIT') {
            return eTtl -= Number(item.forwardedBalance.amount);
        } else {
            return eTtl += Number(item.forwardedBalance.amount);
        }
    });
    return Number(eTtl.toFixed(2));
};

const calculateTotalExpense = data => {
    let eTtl;
    eTtl = 0;
    each(data, (item: any) => {
        if (item.closingBalance.type === 'CREDIT') {
            return eTtl -= Number(item.closingBalance.amount);
        } else {
            return eTtl += Number(item.closingBalance.amount);
        }
    });
    return Number(eTtl.toFixed(2));
};

const calculateTotalExpenseEnd = data => {
    let eTtl;
    eTtl = 0;
    each(data, (item: any) => {
        if (item.forwardedBalance.type === 'CREDIT') {
            return eTtl -= Number(item.forwardedBalance.amount);
        } else {
            return eTtl += Number(item.forwardedBalance.amount);
        }
    });
    return Number(eTtl.toFixed(2));
};
// BS Functions

const filterBalanceSheetData = data => {
    let filterPlData: BalanceSheetData = {};
    filterPlData.assets = [];
    filterPlData.liabilities = [];
    filterPlData.othArr = [];
    each(data, (grp: any) => {
        grp.isVisible = false;
        switch (grp.category) {
            case 'assets':
                return filterPlData.assets.push(grp);
            case 'liabilities':
                return filterPlData.liabilities.push(grp);
            default:
                return filterPlData.othArr.push(grp);
        }
    });
    return filterPlData;
};

const prepareBalanceSheetData = (data) => {
    let bsData: BalanceSheetData = filterBalanceSheetData(data.groupDetails);
    bsData.assetTotal = calCulateTotalAssets(bsData.assets);
    bsData.assetTotalEnd = calCulateTotalAssetsEnd(bsData.assets);
    bsData.liabTotal = calCulateTotalLiab(bsData.liabilities);
    bsData.liabTotalEnd = calCulateTotalLiabEnd(bsData.liabilities);
    bsData.message = data.message;
    return bsData;
};

const calCulateTotalAssets = data => {
    let total;
    total = 0;
    each(data, (obj: any) => {
        if (obj.closingBalance.type === 'CREDIT') {
            return total -= obj.closingBalance.amount;
        } else {
            return total += obj.closingBalance.amount;
        }
    });
    return total;
};
const calCulateTotalAssetsEnd = data => {
    let total;
    total = 0;
    each(data, (obj: any) => {
        if (obj.forwardedBalance.type === 'CREDIT') {
            return total -= obj.forwardedBalance.amount;
        } else {
            return total += obj.forwardedBalance.amount;
        }
    });
    return total;
};
const calCulateTotalLiab = data => {
    let total;
    total = 0;
    each(data, (obj: any) => {
        if (obj.closingBalance.type === 'DEBIT') {
            return total -= obj.closingBalance.amount;
        } else {
            return total += obj.closingBalance.amount;
        }
    });
    return total;
};
const calCulateTotalLiabEnd = data => {
    let total;
    total = 0;
    each(data, (obj: any) => {
        if (obj.forwardedBalance.type === 'DEBIT') {
            return total -= obj.forwardedBalance.amount;
        } else {
            return total += obj.forwardedBalance.amount;
        }
    });
    return total;
};

class ParentGrp {
    public accounts: any[] = [];
    public category: string;
    public closingBalance: { amount: 0, type: string } = { amount: 0, type: '' };
    public creditTotal: number = 0;
    public debitTotal: number = 0;
    public forwardedBalance: { amount: number, type: string } = { amount: 0, type: '' };
    public childGroups: any[] = [];
    public groupName: string;
    public uniqueName: string;
    public isVisible?: boolean;
    public level1?: boolean = true;
}

const revenueParentGrp = (data: ParentGrp, statement) => {
    data.groupName = 'Revenue';
    data.uniqueName = 'revenue';
    data.category = 'income';
    data.closingBalance = statement;
    data.isVisible = true;
    return data;
};
const operatingExpParentGrp = (data: ParentGrp, statement) => {
    data.groupName = 'Less: Operating Expenses';
    data.uniqueName = 'operatingexpenses';
    data.category = 'expenses';
    data.closingBalance = statement;
    data.isVisible = true;
    return data;
};
const otherExpParentGrp = (data: ParentGrp, statement) => {
    data.groupName = 'Less: Other Expenses';
    data.uniqueName = 'otherexpenses';
    data.category = 'expenses';
    data.closingBalance = statement;
    data.isVisible = true;
    return data;
};
