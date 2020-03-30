export const underStandingTextData = [
    {
        accountType: 'Debtors',
        text: {
            cr: 'Is <accountName> giver?',
            dr: 'Is <accountName> receiver?'
        },
        balanceText: {
            cr: 'Advance from Debtors',
            dr: 'Due'
        }
    },
    {
        accountType: 'Creditors',
        text: {
            cr: 'Is <accountName> giver?',
            dr: 'Is <accountName> receiver?'
        },
        balanceText: {
            cr: 'Payable to creditors',
            dr: 'Advance to creditors'
        }
    },
    {
        accountType: 'Revenue',
        text: {
            cr: '+ <accountName> (Increasing)',
            dr: '- <accountName> (Decreasing)'
        },
        balanceText: {
            cr: 'Revenue',
            dr: '(-) Negative Revenue'
        }
    },
    {
        accountType: 'Expense',
        text: {
            cr: '<accountName> ↓  (decreasing)',
            dr: '<accountName> ↑ (Increasing)'
        },
        balanceText: {
            cr: 'Negative Expense (looks strange) ',
            dr: 'Expense'
        }
    },
    {
        accountType: 'Asset',
        text: {
            cr: '<accountName> is Going out (-)',
            dr: '<accountName> is Coming in (+)'
        },
        balanceText: {
            cr: '(-) Asset ( ohh no!)',
            dr: 'Asset value'
        }
    },
    {
        accountType: 'Liability',
        text: {
            cr: `<accountName> is increasing ↑`,
            dr: '<accountName> is decreasing ↓'
        },
        balanceText: {
            cr: 'Liability Payable',
            dr: 'Liabilities paid in advance (hurrey!)'
        }
    },
    {
        accountType: 'ReverseCharge',
        text: {
            cr: `<accountName> is decreasing ↓`,
            dr: '<accountName> is increasing ↑'
        },
        balanceText: {
            cr: '(-) Reverse Charge ( ohh no!)',
            dr: 'Reverse Charge value'
        }
    },
    {
        accountType: null,
        text: {
            cr: '<accountName> liability is going out',
            dr: '<accountName> liability is coming in'
        },
        balanceText: {
            cr: '',
            dr: ''
        }
    }
];
