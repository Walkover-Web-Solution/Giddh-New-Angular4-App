import { ChildGroup } from '../../models/api-models/Search';

/**
 * Shared utility for profit loss report processing logic
 * Used by profit-loss.component and profit-loss-report.component
 * 
 * Extracted from Groups 9, 16 duplication analysis
 */
export class ProfitLossProcessingHelper {
    /**
     * Processes COGS (Cost of Goods Sold) data into a structured group
     * 
     * @param cogs COGS data object
     * @param includeLevel1 Whether to include level1 property (standard P&L only)
     * @returns Processed COGS group
     */
    public static processCOGS(cogs: any, includeLevel1: boolean = false): ChildGroup {
        const cogsGrp = new ChildGroup();
        cogsGrp.isCreated = false;
        cogsGrp.isSelfCreatedGroup = true;
        cogsGrp.isVisible = false;
        cogsGrp.isIncludedInSearch = true;
        cogsGrp.isOpen = false;
        
        if (includeLevel1) {
            cogsGrp.level1 = true;
        }
        
        cogsGrp.uniqueName = 'cogs';
        cogsGrp.groupName = 'Less: Cost of Goods Sold';
        cogsGrp.closingBalance = Object.keys(cogs).reduce((acc, key) => {
            acc[key] = {
                amount: cogs[key].cogs,
                type: 'DEBIT'
            };
            return acc;
        }, {});
        cogsGrp.accounts = [];
        cogsGrp.childGroups = [];

        Object.keys(cogs).forEach((cogsKey, i) => {
            if (i === 0) {
                Object.keys(cogs[cogsKey])?.filter(data => 
                    ['openingInventory', 'closingInventory', 'purchasesStockAmount', 'manufacturingExpenses', 'debitNoteStockAmount'].includes(data)
                ).forEach(item => {
                    let childGroup = new ChildGroup();
                    childGroup.isCreated = false;
                    childGroup.isSelfCreatedGroup = true;
                    childGroup.isVisible = false;
                    childGroup.isIncludedInSearch = true;
                    childGroup.isOpen = false;
                    childGroup.uniqueName = item;
                    childGroup.groupName = (item) ? item?.replace(/([a-z0-9])([A-Z])/g, '$1 $2') : "";
                    childGroup.category = item === 'income';
                    childGroup.closingBalance = Object.keys(cogs).reduce((acc, key) => {
                        acc[key] = {
                            amount: cogs[key][item],
                            type: 'CREDIT'
                        };
                        return acc;
                    }, {});
                    childGroup.accounts = [];
                    childGroup.childGroups = [];

                    if (['purchasesStockAmount', 'manufacturingExpenses'].includes(item)) {
                        childGroup.groupName = `+ ${childGroup.groupName}`;
                    } else if (['closingInventory', 'debitNoteStockAmount'].includes(item)) {
                        childGroup.groupName = `- ${childGroup.groupName}`;
                    }
                    cogsGrp.childGroups.push(childGroup);
                });
            }
        });

        return cogsGrp;
    }

    /**
     * Initializes income or expense array data with category and visibility flags
     * 
     * @param dataArray Array of income or expense data
     * @param category Category type ('income' or 'expenses')
     */
    public static initializeIncomeExpenseData(dataArray: any[], category: 'income' | 'expenses'): void {
        (Array.isArray(dataArray) ? dataArray : []).forEach(group => {
            group.category = category;
            group.isVisible = true;
            group.isCreated = true;
            group.isIncludedInSearch = true;
            group.isOpen = true;
            (Array.isArray(group.childGroups) ? group.childGroups : []).forEach(childGroups => {
                childGroups.category = category;
                childGroups.isVisible = true;
                childGroups.isCreated = true;
                childGroups.isIncludedInSearch = true;
            });
        });
    }

    /**
     * Processes gross profit and operating profit amounts
     * Converts DEBIT type amounts to negative values
     * 
     * @param incomeStatement Income statement data
     */
    public static processIncomeStatementAmounts(incomeStatement: any): void {
        if (incomeStatement?.grossProfit) {
            const grossProfitKey = Object.keys(incomeStatement.grossProfit)[0];
            if (incomeStatement.grossProfit[grossProfitKey]?.type === "DEBIT" && 
                incomeStatement.grossProfit[grossProfitKey].amount) {
                incomeStatement.grossProfit[grossProfitKey].amount = 
                    "-" + incomeStatement.grossProfit[grossProfitKey].amount;
            }
        }

        if (incomeStatement?.operatingProfit) {
            const operatingProfitKey = Object.keys(incomeStatement.operatingProfit)[0];
            if (incomeStatement.operatingProfit[operatingProfitKey]?.type === "DEBIT" && 
                incomeStatement.operatingProfit[operatingProfitKey].amount) {
                incomeStatement.operatingProfit[operatingProfitKey].amount = 
                    "-" + incomeStatement.operatingProfit[operatingProfitKey].amount;
            }
        }
    }
}
