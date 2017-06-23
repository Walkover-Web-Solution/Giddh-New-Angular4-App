export let mockData = [
  {
    uniqueName: 'capital',
    synonyms: 'Debtors, Stock, Bank balance',
    accounts: [],
    category: 'liabilities',
    groups: [
      {
        uniqueName: 'reservessurplus',
        synonyms: null,
        accounts: [],
        category: 'liabilities',
        groups: [
          {
            uniqueName: 'gdfgfd',
            synonyms: null,
            accounts: [],
            category: 'liabilities',
            groups: [],
            name: 'gfdgfd'
          },
          {
            uniqueName: 'vxcvcxvxcv',
            synonyms: null,
            accounts: [],
            category: 'liabilities',
            groups: [],
            name: 'vxcvxcvxc'
          }
        ],
        name: 'Reserves & Surplus'
      },
      {
        uniqueName: 'reserves&surplus',
        synonyms: null,
        accounts: [
          {
            stocks: null,
            uniqueName: 'generalreserves',
            mergedAccounts: '',
            name: 'General Reserves'
          }
        ],
        category: 'liabilities',
        groups: [
          {
            uniqueName: 'test',
            synonyms: null,
            accounts: [],
            category: 'liabilities',
            groups: [],
            name: 'test'
          }
        ],
        name: 'Reserves & Surplus'
      }
    ],
    name: 'Capital'
  },
  {
    uniqueName: 'loan',
    synonyms:
      'House loan, Car loan, Secured business loan, Education loan, Personal loan',
    accounts: [],
    category: 'liabilities',
    groups: [],
    name: 'Loan'
  },
  {
    uniqueName: 'currentliabilities',
    synonyms: 'Vendors, Outstanding Expenses, TDS, Income Tax, Service Tax',
    accounts: [],
    category: 'liabilities',
    groups: [
      {
        uniqueName: 'sundrycreditors',
        synonyms: null,
        accounts: [
          {
            stocks: null,
            uniqueName: 'giddh',
            mergedAccounts: '',
            name: 'Walkover Technologies Private Limited'
          }
        ],
        category: 'liabilities',
        groups: [],
        name: 'Sundry Creditors'
      },
      {
        uniqueName: 'tax',
        synonyms: null,
        accounts: [],
        category: 'liabilities',
        groups: [],
        name: 'tax'
      },
      {
        uniqueName: 'taxes',
        synonyms: null,
        accounts: [
          {
            stocks: null,
            uniqueName: 'utgst',
            mergedAccounts: '',
            name: 'UTGST'
          },
          {
            stocks: null,
            uniqueName: 'cgst',
            mergedAccounts: '',
            name: 'CGST'
          },
          { stocks: null, uniqueName: 'sgst', mergedAccounts: '', name: 'SGST' }
        ],
        category: 'liabilities',
        groups: [],
        name: 'Taxes'
      }
    ],
    name: 'Current Liabilities'
  },
  {
    uniqueName: 'fixedassets',
    synonyms:
      'Land & Building, Plant & Machinery, Goodwill, Patents, Long Term Assets/ Non Current Assets',
    accounts: [],
    category: 'assets',
    groups: [
      {
        uniqueName: 'intan',
        synonyms: null,
        accounts: [
          {
            stocks: null,
            uniqueName: 'softw',
            mergedAccounts: '',
            name: 'PHP Software'
          }
        ],
        category: 'assets',
        groups: [],
        name: 'Intangible assets 1'
      }
    ],
    name: 'Fixed Assets'
  },
  {
    uniqueName: 'investments',
    synonyms: 'Mutual Funds, shares, Land, fixed deposit',
    accounts: [],
    category: 'assets',
    groups: [
      {
        uniqueName: 'inve',
        synonyms: null,
        accounts: [
          {
            stocks: null,
            uniqueName: 'sip',
            mergedAccounts: '',
            name: 'SIP CITI BANK'
          },
          {
            stocks: null,
            uniqueName: 'frank',
            mergedAccounts: '',
            name: 'FRANKLIN INV'
          }
        ],
        category: 'assets',
        groups: [],
        name: 'INVESTMENTS'
      }
    ],
    name: 'Investments'
  },
  {
    uniqueName: 'currentassets',
    synonyms: 'Debtors, Stock, Bank balance',
    accounts: [],
    category: 'assets',
    groups: [
      {
        uniqueName: 'bankaccounts',
        synonyms: null,
        accounts: [],
        category: 'assets',
        groups: [
          {
            uniqueName: 'firmaccount',
            synonyms: null,
            accounts: [],
            category: 'assets',
            groups: [
              {
                uniqueName: 'fdsf',
                synonyms: null,
                accounts: [],
                category: 'assets',
                groups: [],
                name: 'fsdfds'
              },
              {
                uniqueName: 'fdsfsdf',
                synonyms: null,
                accounts: [],
                category: 'assets',
                groups: [
                  {
                    uniqueName: 'dasasd',
                    synonyms: null,
                    accounts: [],
                    category: 'assets',
                    groups: [
                      {
                        uniqueName: 'dasdas',
                        synonyms: null,
                        accounts: [],
                        category: 'assets',
                        groups: [],
                        name: 'nested'
                      }
                    ],
                    name: 'das'
                  }
                ],
                name: 'tste'
              }
            ],
            name: 'FirmAccount'
          }
        ],
        name: 'Bank Accounts'
      },
      {
        uniqueName: 'cash',
        synonyms: null,
        accounts: [
          { stocks: null, uniqueName: 'cash', mergedAccounts: '', name: 'Cash' }
        ],
        category: 'assets',
        groups: [],
        name: 'Cash'
      },
      {
        uniqueName: 'sundrydebtors',
        synonyms: null,
        accounts: [],
        category: 'assets',
        groups: [],
        name: 'Sundry Debtors'
      }
    ],
    name: 'Current Assets'
  },
  {
    uniqueName: 'revenuefromoperations',
    synonyms: 'Revenues, Sales',
    accounts: [],
    category: 'income',
    groups: [
      {
        uniqueName: 'demo',
        synonyms: null,
        accounts: [],
        category: 'income',
        groups: [
          {
            uniqueName: 'deni',
            synonyms: null,
            accounts: [],
            category: 'income',
            groups: [],
            name: 'demo'
          }
        ],
        name: 'demo'
      },
      {
        uniqueName: 'sales',
        synonyms: null,
        accounts: [
          {
            stocks: null,
            uniqueName: 'sales',
            mergedAccounts: 'vat, sbi',
            name: 'Sales'
          }
        ],
        category: 'income',
        groups: [],
        name: 'Sales'
      }
    ],
    name: 'Revenue From Operations'
  },
  {
    uniqueName: 'otherincome',
    synonyms: 'Interest on F.D, Profit on sale of fixed asset',
    accounts: [],
    category: 'income',
    groups: [
      {
        uniqueName: 'fees',
        synonyms: null,
        accounts: [],
        category: 'income',
        groups: [],
        name: 'fees'
      }
    ],
    name: 'Other Income'
  },
  {
    uniqueName: 'operatingcost',
    synonyms: 'Purchases, Direct labour, Carrying cost',
    accounts: [],
    category: 'expenses',
    groups: [
      {
        uniqueName: 'discount',
        synonyms: null,
        accounts: [
          {
            stocks: null,
            uniqueName: '5percent',
            mergedAccounts: '',
            name: '5percent'
          }
        ],
        category: 'expenses',
        groups: [],
        name: 'Discount'
      },
      {
        uniqueName: 'purchases',
        synonyms: null,
        accounts: [
          {
            stocks: null,
            uniqueName: 'purchases',
            mergedAccounts: '',
            name: 'Purchases'
          }
        ],
        category: 'expenses',
        groups: [],
        name: 'Purchases'
      }
    ],
    name: 'Operating Cost'
  },
  {
    uniqueName: 'indirectexpenses',
    synonyms: 'Salary, Office expenses, Selling & distribution expenses',
    accounts: [],
    category: 'expenses',
    groups: [
      {
        uniqueName: 'otherindirectexpenses',
        synonyms: null,
        accounts: [
          {
            stocks: null,
            uniqueName: 'roundoff',
            mergedAccounts: '',
            name: 'Round Off'
          }
        ],
        category: 'expenses',
        groups: [],
        name: 'Other Indirect Expenses'
      }
    ],
    name: 'Indirect Expenses'
  }
];
