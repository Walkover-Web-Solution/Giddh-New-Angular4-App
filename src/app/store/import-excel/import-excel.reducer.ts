import { CustomActions } from '../customActions';
import { IMPORT_EXCEL } from '../../actions/import-excel/import-excel.const';
import { ImportExcelResponseData } from '../../models/api-models/import-excel';
import { COMMON_ACTIONS } from '../../actions/common.const';
import { BaseResponse } from '../../models/api-models/BaseResponse';

export enum ImportExcelRequestStates {
  Default,
  UploadFileInProgress,
  UploadFileError,
  UploadFileSuccess,
  ProcessImportInProgress,
  ProcessImportSuccess
}

export interface ImportExcelState {
  requestState: ImportExcelRequestStates;
  importExcelData?: ImportExcelResponseData;
  importRequestIsSuccess: boolean;
  importResponse?: any;

}

export const initialState: ImportExcelState = {
  requestState: ImportExcelRequestStates.Default,
  importRequestIsSuccess: false,
  importExcelData: {
    headers: {
      items: [
        {
          columnNumber: '0',
          columnHeader: 'Date*'
        },
        {
          columnNumber: '1',
          columnHeader: 'Debit Account'
        },
        {
          columnNumber: '2',
          columnHeader: 'Credit Account'
        },
        {
          columnNumber: '3',
          columnHeader: 'Voucher Type'
        },
        {
          columnNumber: '4',
          columnHeader: 'Amount'
        },
        {
          columnNumber: '5',
          columnHeader: 'Converted Amount'
        },
        {
          columnNumber: '6',
          columnHeader: 'Description'
        },
        {
          columnNumber: '7',
          columnHeader: 'Tax Rate/TaxUniqueName'
        },
        {
          columnNumber: '8',
          columnHeader: 'Other Tax'
        },
        {
          columnNumber: '9',
          columnHeader: 'Discount'
        },
        {
          columnNumber: '10',
          columnHeader: 'Item Name'
        },
        {
          columnNumber: '11',
          columnHeader: 'Quantity'
        },
        {
          columnNumber: '12',
          columnHeader: 'Unit'
        },
        {
          columnNumber: '13',
          columnHeader: 'Invoice Number'
        }
      ],
      numColumns: 14
    },
    mappings: [
      {
        column: 4,
        suggestedColumnHeader: 'amount',
        columnHeader: 'amount'
      },
      {
        column: 11,
        suggestedColumnHeader: 'quantity',
        columnHeader: 'quantity'
      },
      {
        column: 10,
        suggestedColumnHeader: 'itemname',
        columnHeader: 'itemname'
      },
      {
        column: 6,
        suggestedColumnHeader: 'description',
        columnHeader: 'description'
      },
      {
        column: 8,
        suggestedColumnHeader: 'othertax',
        columnHeader: 'othertax'
      },
      {
        column: 9,
        suggestedColumnHeader: 'discount',
        columnHeader: 'discount'
      },
      {
        column: 5,
        suggestedColumnHeader: 'convertedamount',
        columnHeader: 'convertedamount'
      },
      {
        column: 12,
        suggestedColumnHeader: 'unit',
        columnHeader: 'unit'
      },
      {
        column: 3,
        suggestedColumnHeader: 'vouchertype',
        columnHeader: 'vouchertype'
      },
      {
        column: 7,
        suggestedColumnHeader: 'taxrate/taxuniquename',
        columnHeader: 'taxrate/taxuniquename'
      },
      {
        column: 0,
        suggestedColumnHeader: 'date',
        columnHeader: 'EntryDate'
      },
      {
        column: 1,
        suggestedColumnHeader: 'debitaccount',
        columnHeader: 'Debit Account Name'
      },
      {
        column: 2,
        suggestedColumnHeader: 'creditaccount',
        columnHeader: 'Credit Account Name'
      },
      {
        column: 13,
        suggestedColumnHeader: 'invoicenumber',
        columnHeader: 'invoicenumber'
      }
    ],
    data: {
      items: [
        {
          row: [
            {
              columnValue: '04/04/2017',
              valid: true
            },
            {
              columnValue: 'OpeningBalance',
              valid: true
            },
            {
              columnValue: 'Bank',
              valid: true
            },
            {
              columnValue: 'Journal',
              valid: true
            },
            {
              columnValue: '50000',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 1
        },
        {
          row: [
            {
              columnValue: '04"-"04"-"2017',
              valid: true
            },
            {
              columnValue: 'ROLL AND SWIRL LLP',
              valid: true
            },
            {
              columnValue: 'Sales',
              valid: true
            },
            {
              columnValue: 'Sales',
              valid: true
            },
            {
              columnValue: '2000',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '5',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '100',
              valid: true
            },
            {
              columnValue: 'Product 1',
              valid: true
            },
            {
              columnValue: '12',
              valid: true
            },
            {
              columnValue: 'nos',
              valid: true
            },
            {
              columnValue: 'INV-205',
              valid: true
            }
          ],
          rowNumber: 2
        },
        {
          row: [
            {
              columnValue: '07"-"04"-"2017',
              valid: true
            },
            {
              columnValue: 'Salary',
              valid: true
            },
            {
              columnValue: 'Bank',
              valid: true
            },
            {
              columnValue: 'Payment',
              valid: true
            },
            {
              columnValue: '13000',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: 'Salary For Employee',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 3
        },
        {
          row: [
            {
              columnValue: '07"-"04"-"2017',
              valid: true
            },
            {
              columnValue: 'RISEMETRIC TECHNOLOGY LLP',
              valid: true
            },
            {
              columnValue: 'Sales',
              valid: true
            },
            {
              columnValue: 'Sales',
              valid: true
            },
            {
              columnValue: '40000',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '12',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '500',
              valid: true
            },
            {
              columnValue: 'Product 2',
              valid: true
            },
            {
              columnValue: '10',
              valid: true
            },
            {
              columnValue: 'kg',
              valid: true
            },
            {
              columnValue: 'INV-206',
              valid: true
            }
          ],
          rowNumber: 4
        },
        {
          row: [
            {
              columnValue: '07"-"04"-"2017',
              valid: true
            },
            {
              columnValue: 'RISEMETRIC TECHNOLOGY LLP',
              valid: true
            },
            {
              columnValue: 'Sales',
              valid: true
            },
            {
              columnValue: 'Sales',
              valid: true
            },
            {
              columnValue: '80000',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '5',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: 'Product 3',
              valid: true
            },
            {
              columnValue: '5',
              valid: true
            },
            {
              columnValue: 'nos',
              valid: true
            },
            {
              columnValue: 'INV-207',
              valid: true
            }
          ],
          rowNumber: 5
        },
        {
          row: [
            {
              columnValue: '07"-"04"-"2017',
              valid: true
            },
            {
              columnValue: 'Purchases',
              valid: true
            },
            {
              columnValue: 'Bulk SMS',
              valid: true
            },
            {
              columnValue: 'Purchases',
              valid: true
            },
            {
              columnValue: '5000',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '18',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: 'SMS',
              valid: true
            },
            {
              columnValue: '50000',
              valid: true
            },
            {
              columnValue: 'nos',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 6
        },
        {
          row: [
            {
              columnValue: '07"-"04"-"2017',
              valid: true
            },
            {
              columnValue: 'Loans',
              valid: true
            },
            {
              columnValue: 'Loan',
              valid: true
            },
            {
              columnValue: 'Credit Note',
              valid: true
            },
            {
              columnValue: '7000',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 7
        },
        {
          row: [
            {
              columnValue: '07"-"04"-"2017',
              valid: true
            },
            {
              columnValue: 'Cash',
              valid: true
            },
            {
              columnValue: 'Sundry Expenses',
              valid: true
            },
            {
              columnValue: 'Receipt',
              valid: true
            },
            {
              columnValue: '600',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 8
        },
        {
          row: [
            {
              columnValue: '12"-"04"-"2017',
              valid: true
            },
            {
              columnValue: 'Cash',
              valid: true
            },
            {
              columnValue: 'Sundry Expenses',
              valid: true
            },
            {
              columnValue: 'Receipt',
              valid: true
            },
            {
              columnValue: '900',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 9
        },
        {
          row: [
            {
              columnValue: '13/04/2017',
              valid: true
            },
            {
              columnValue: 'Salary',
              valid: true
            },
            {
              columnValue: 'Bank',
              valid: true
            },
            {
              columnValue: 'Payment',
              valid: true
            },
            {
              columnValue: '12000',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 10
        },
        {
          row: [
            {
              columnValue: '04/04/2017',
              valid: true
            },
            {
              columnValue: 'OpeningBalance',
              valid: true
            },
            {
              columnValue: 'Bank',
              valid: true
            },
            {
              columnValue: 'Journal',
              valid: true
            },
            {
              columnValue: '1526.666667',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 11
        },
        {
          row: [
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 12
        },
        {
          row: [
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 13
        },
        {
          row: [
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 14
        },
        {
          row: [
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 15
        },
        {
          row: [
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 16
        },
        {
          row: [
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 17
        },
        {
          row: [
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 18
        },
        {
          row: [
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 19
        },
        {
          row: [
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            },
            {
              columnValue: '',
              valid: true
            }
          ],
          rowNumber: 20
        }
      ],
      numRows: 5,
      totalRows: 5
    },
    giddhHeaders: [
      'entry date',
      'debit account name',
      'debit account unique name',
      'credit account name',
      'credit account unique name',
      'voucher type',
      'amount',
      'converted amount',
      'description',
      'tax rate/tax unique name',
      'other tax',
      'discount',
      'item name',
      'quantity',
      'unit',
      'invoice number'
    ],
    mandatoryHeaders: [
      'debit account unique name',
      'credit account unique name',
      'Amount'
    ]
  },
  importResponse: {},
};

export function importExcelReducer(state = initialState, action: CustomActions): ImportExcelState {
  switch (action.type) {
    case COMMON_ACTIONS.RESET_APPLICATION_DATA: {
      return Object.assign({}, state, initialState);
    }
    case IMPORT_EXCEL.UPLOAD_FILE_REQUEST: {
      return {...state, importRequestIsSuccess: false, requestState: ImportExcelRequestStates.UploadFileInProgress};
    }
    case IMPORT_EXCEL.UPLOAD_FILE_RESPONSE: {
      let response: BaseResponse<ImportExcelResponseData, string> = action.payload;
      let newState = _.cloneDeep(state);
      if (response.status === 'success') {
        newState.importRequestIsSuccess = true;
        newState.requestState = ImportExcelRequestStates.UploadFileSuccess;
        newState.importExcelData = response.body;
        return Object.assign({}, state, newState);
      }
      return {
        ...state,
        importRequestIsSuccess: false,
        requestState: ImportExcelRequestStates.UploadFileError,
        importExcelData: null
      };
    }
    case IMPORT_EXCEL.PROCESS_IMPORT_REQUEST: {
      return {...state, requestState: ImportExcelRequestStates.ProcessImportInProgress};
    }
    case IMPORT_EXCEL.PROCESS_IMPORT_RESPONSE: {
      let response: BaseResponse<ImportExcelResponseData, string> = action.payload;
      let newState = _.cloneDeep(state);
      newState.importResponse = action.payload;
      return {...state, importResponse: action.payload, requestState: ImportExcelRequestStates.ProcessImportSuccess};
    }
    case IMPORT_EXCEL.RESET_IMPORT_EXCEL_STATE:
      return initialState;
    default: {
      return state;
    }
  }
}
