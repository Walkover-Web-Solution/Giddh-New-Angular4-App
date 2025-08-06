import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CustomTemplateResponse } from '../../../models/api-models/Invoice';
import { TemplateContentUISectionVisibility } from '../../../services/invoice.ui.data.service';
import { Store, select } from '@ngrx/store';
import { Observable, of as observableOf, ReplaySubject, takeUntil } from 'rxjs';
import { SettingsProfileActions } from '../../../actions/settings/profile/settings.profile.action';
import { cloneDeep } from '../../../lodash-optimized';
import { ServiceConfig } from '../../../services/service.config';
import { CountryNames } from '../../../shared/Enums/common.enum';
import { AppState } from '../../../store';

@Component({
  selector: 'app-gst-template-a',
  templateUrl: './gst-template-a.component.html',
  styleUrls: ['./gst-template-a.component.scss']
})
export class GstTemplateAComponent implements OnInit {
  // @Input() public fieldsAndVisibility: any = null;
  @Input() public fieldsAndVisibility: any =
    {
      "header": {
        "shippingDate": {
          "label": "Ship Date",
          "display": true,
          "width": null
        },
        "showEInvoiceDetails": {
          "label": "",
          "display": true,
          "width": null
        },
        "customField1": {
          "label": "",
          "display": true,
          "width": null
        },
        "customField2": {
          "label": "",
          "display": true,
          "width": null
        },
        "shippedVia": {
          "label": "Ship Via",
          "display": true,
          "width": null
        },
        "customField3": {
          "label": "",
          "display": true,
          "width": null
        },
        "companyName": {
          "label": "AAAAE-invoiced",
          "display": true,
          "width": null
        },
        "displayExchangeRate": {
          "label": "",
          "display": true,
          "width": null
        },
        "displayLutNumber": {
          "label": "",
          "display": true,
          "width": null
        },
        "displayPlaceOfSupply": {
          "label": "",
          "display": true,
          "width": null
        },
        "displayPlaceOfCountry": {
          "label": "",
          "display": true,
          "width": null
        },
        "dueDate": {
          "label": "Due Date",
          "display": true,
          "width": null
        },
        "gstComposition": {
          "label": "Registered under Composition Scheme",
          "display": true,
          "width": null
        },
        "gstin": {
          "label": "GSTIN",
          "display": true,
          "width": null
        },
        "shippingGstin": {
          "label": "GSTIN",
          "display": true,
          "width": null
        },
        "voucherNumber": {
          "label": "Voucher No.",
          "display": true,
          "width": null
        },
        "customerEmail": {
          "label": "",
          "display": true,
          "width": null
        },
        "invoiceNumber": {
          "label": "Invoice No.",
          "display": true,
          "width": null
        },
        "showQrCode": {
          "label": "",
          "display": true,
          "width": null
        },
        "voucherDate": {
          "label": "Voucher Date",
          "display": true,
          "width": null
        },
        "customerMobileNumber": {
          "label": "",
          "display": true,
          "width": null
        },
        "attentionTo": {
          "label": "Attention To",
          "display": true,
          "width": null
        },
        "pan": {
          "label": "PAN",
          "display": true,
          "width": null
        },
        "trackingNumber": {
          "label": "Tracking No.",
          "display": true,
          "width": null
        },
        "formNameInvoice": {
          "label": "INVOICE",
          "display": true,
          "width": null
        },
        "billingGstin": {
          "label": "GSTIN",
          "display": true,
          "width": null
        },
        "address": {
          "label": "",
          "display": true,
          "width": null
        },
        "billingState": {
          "label": "State",
          "display": true,
          "width": null
        },
        "invoiceDate": {
          "label": "Invoice Date",
          "display": true,
          "width": null
        },
        "customerName": {
          "label": "",
          "display": true,
          "width": null
        },
        "formNameTaxInvoice": {
          "label": "TAX INVOICE",
          "display": true,
          "width": null
        },
        "shippingAddress": {
          "label": "Shipping Address",
          "display": true,
          "width": null
        },
        "shippingState": {
          "label": "State",
          "display": true,
          "width": null
        },
        "billingAddress": {
          "label": "Billing Address",
          "display": true,
          "width": null
        },
        "warehouseAddress": {
          "label": "",
          "display": true,
          "width": null
        },
        "showCompanyAddress": {
          "label": "",
          "display": true,
          "width": null
        }
      },
      "table": {
        "date": {
          "label": "Date",
          "display": true,
          "width": "10"
        },
        "item": {
          "label": "Description",
          "display": true,
          "width": "10"
        },
        "total": {
          "label": "Total",
          "display": true,
          "width": "10"
        },
        "quantity": {
          "label": "Qty.",
          "display": true,
          "width": "10"
        },
        "sNo": {
          "label": "#",
          "display": true,
          "width": "10"
        },
        "rate": {
          "label": "Rate/ Item",
          "display": true,
          "width": "10"
        },
        "showVariantImage": {
          "label": "Display Image",
          "display": true,
          "width": "15"
        },
        "taxableValue": {
          "label": "Taxable Amt.",
          "display": true,
          "width": "10"
        },
        "previousDue": {
          "label": "Previous Due",
          "display": true,
          "width": null
        },
        "description": {
          "label": "Some label",
          "display": true,
          "width": "10"
        },
        "discount": {
          "label": "Dis./ Item",
          "display": true,
          "width": "10"
        },
        "taxes": {
          "label": "Taxes",
          "display": true,
          "width": "10"
        },
        "displayBaseCurrency": {
          "label": "",
          "display": true,
          "width": null
        },
        "showDescriptionInRows": {
          "label": "",
          "display": true,
          "width": null
        },
        "amountBeforeDiscount": {
          "label": "Total Before Dis.",
          "display": true,
          "width": null
        },
        "hsnSac": {
          "label": "HSN/SAC",
          "display": true,
          "width": "10"
        },
        "otherTaxBifurcation": {
          "label": "TCS",
          "display": true,
          "width": null
        },
        "totalQuantity": {
          "label": "Total Quantity",
          "display": true,
          "width": null
        }
      },
      "footer": {
        "totalTax": {
          "label": "Total Tax*",
          "display": true,
          "width": null
        },
        "displayExportMessage": {
          "label": "",
          "display": true,
          "width": null
        },
        "thanks": {
          "label": "Thank You for your business.",
          "display": true,
          "width": null
        },
        "taxableAmount": {
          "label": "Sub Total",
          "display": true,
          "width": null
        },
        "otherDeduction": {
          "label": "",
          "display": true,
          "width": null
        },
        "imageSignature": {
          "label": "",
          "display": true,
          "width": null
        },
        "grandTotal": {
          "label": "Invoice Total",
          "display": true,
          "width": null
        },
        "totalInWords": {
          "label": "Invoice Total (In words)",
          "display": true,
          "width": null
        },
        "totalDue": {
          "label": "Total Due",
          "display": true,
          "width": null
        },
        "companyAddress": {
          "label": "",
          "display": true,
          "width": null
        },
        "companyName": {
          "label": "AAAAE-invoiced",
          "display": true,
          "width": null
        },
        "slogan": {
          "label": "",
          "display": true,
          "width": null
        },
        "textUnderSlogan": {
          "label": "",
          "display": true,
          "width": null
        },
        "showNotesAtLastPage": {
          "label": "",
          "display": true,
          "width": null
        },
        "message1": {
          "label": "",
          "display": true,
          "width": null
        },
        "showMessage2": {
          "label": "",
          "display": true,
          "width": null
        },
        "tcs": {
          "label": "TCS",
          "display": true,
          "width": null
        },
        "tds": {
          "label": "TDS",
          "display": true,
          "width": null
        },
        "taxBifurcation": {
          "label": "Tax Bifurcation",
          "display": true,
          "width": null
        }
      }
    }
  // @Input() public isPreviewMode: boolean = true;
  @Input() public isPreviewMode: boolean = true;
  @Input() public showLogo: boolean = true;
  @Input() public showCompanyName: boolean;
  @Input() public companyGSTIN: string;
  @Input() public companyPAN: string;
  // @Input() public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
  @Input() public inputTemplate: any = {
    "createdBy": null,
    "fontSize": 14,
    "fontSmall": 10,
    "fontDefault": 14,
    "isDefault": true,
    "fontMedium": 12,
    "isDefaultForVoucher": true,
    "showSectionsInline": true,
    "uniqueName": "gst_template_a",
    "createdAt": "",
    "updatedAt": "",
    "updatedBy": null,
    "showBankQrCode": true,
    "qrCodeId": "",
    "sections": {
      "footer": {
        "data": {
          "totalTax": {
            "label": "Total Tax*",
            "display": true,
            "width": null
          },
          "displayExportMessage": {
            "label": "",
            "display": true,
            "width": null
          },
          "thanks": {
            "label": "Thank You for your business.",
            "display": true,
            "width": null
          },
          "taxableAmount": {
            "label": "Sub Total",
            "display": true,
            "width": null
          },
          "otherDeduction": {
            "label": "",
            "display": true,
            "width": null
          },
          "imageSignature": {
            "label": "",
            "display": true,
            "width": null
          },
          "grandTotal": {
            "label": "Invoice Total",
            "display": true,
            "width": null
          },
          "totalInWords": {
            "label": "Invoice Total (In words)",
            "display": true,
            "width": null
          },
          "totalDue": {
            "label": "Total Due",
            "display": true,
            "width": null
          },
          "companyAddress": {
            "label": "",
            "display": true,
            "width": null
          },
          "companyName": {
            "label": "AAAAE-invoiced",
            "display": true,
            "width": null
          },
          "slogan": {
            "label": "",
            "display": true,
            "width": null
          },
          "textUnderSlogan": {
            "label": "",
            "display": true,
            "width": null
          },
          "showNotesAtLastPage": {
            "label": "",
            "display": true,
            "width": null
          },
          "message1": {
            "label": "",
            "display": true,
            "width": null
          },
          "showMessage2": {
            "label": "",
            "display": true,
            "width": null
          },
          "tcs": {
            "label": "TCS",
            "display": true,
            "width": null
          },
          "tds": {
            "label": "TDS",
            "display": true,
            "width": null
          },
          "taxBifurcation": {
            "label": "Tax Bifurcation",
            "display": true,
            "width": null
          }
        }
      },
      "header": {
        "data": {
          "shippingDate": {
            "label": "Ship Date",
            "display": true,
            "width": null
          },
          "showEInvoiceDetails": {
            "label": "",
            "display": true,
            "width": null
          },
          "customField1": {
            "label": "",
            "display": true,
            "width": null
          },
          "customField2": {
            "label": "",
            "display": true,
            "width": null
          },
          "shippedVia": {
            "label": "Ship Via",
            "display": true,
            "width": null
          },
          "customField3": {
            "label": "",
            "display": true,
            "width": null
          },
          "companyName": {
            "label": "AAAAE-invoiced",
            "display": true,
            "width": null
          },
          "displayExchangeRate": {
            "label": "",
            "display": true,
            "width": null
          },
          "displayLutNumber": {
            "label": "",
            "display": true,
            "width": null
          },
          "displayPlaceOfSupply": {
            "label": "",
            "display": true,
            "width": null
          },
          "displayPlaceOfCountry": {
            "label": "",
            "display": true,
            "width": null
          },
          "dueDate": {
            "label": "Due Date",
            "display": true,
            "width": null
          },
          "gstComposition": {
            "label": "Registered under Composition Scheme",
            "display": true,
            "width": null
          },
          "gstin": {
            "label": "GSTIN",
            "display": true,
            "width": null
          },
          "shippingGstin": {
            "label": "GSTIN",
            "display": true,
            "width": null
          },
          "voucherNumber": {
            "label": "Voucher No.",
            "display": true,
            "width": null
          },
          "customerEmail": {
            "label": "",
            "display": true,
            "width": null
          },
          "invoiceNumber": {
            "label": "Invoice No.",
            "display": true,
            "width": null
          },
          "showQrCode": {
            "label": "",
            "display": true,
            "width": null
          },
          "voucherDate": {
            "label": "Voucher Date",
            "display": true,
            "width": null
          },
          "customerMobileNumber": {
            "label": "",
            "display": true,
            "width": null
          },
          "attentionTo": {
            "label": "Attention To",
            "display": true,
            "width": null
          },
          "pan": {
            "label": "PAN",
            "display": true,
            "width": null
          },
          "trackingNumber": {
            "label": "Tracking No.",
            "display": true,
            "width": null
          },
          "formNameInvoice": {
            "label": "INVOICE",
            "display": true,
            "width": null
          },
          "billingGstin": {
            "label": "GSTIN",
            "display": true,
            "width": null
          },
          "address": {
            "label": "",
            "display": true,
            "width": null
          },
          "billingState": {
            "label": "State",
            "display": true,
            "width": null
          },
          "invoiceDate": {
            "label": "Invoice Date",
            "display": true,
            "width": null
          },
          "customerName": {
            "label": "",
            "display": true,
            "width": null
          },
          "formNameTaxInvoice": {
            "label": "TAX INVOICE",
            "display": true,
            "width": null
          },
          "shippingAddress": {
            "label": "Shipping Address",
            "display": true,
            "width": null
          },
          "shippingState": {
            "label": "State",
            "display": true,
            "width": null
          },
          "billingAddress": {
            "label": "Billing Address",
            "display": true,
            "width": null
          },
          "warehouseAddress": {
            "label": "",
            "display": true,
            "width": null
          },
          "showCompanyAddress": {
            "label": "",
            "display": true,
            "width": null
          }
        }
      },
      "table": {
        "data": {
          "date": {
            "label": "Date",
            "display": true,
            "width": "10"
          },
          "item": {
            "label": "Description",
            "display": true,
            "width": "10"
          },
          "total": {
            "label": "Total",
            "display": true,
            "width": "10"
          },
          "quantity": {
            "label": "Qty.",
            "display": true,
            "width": "10"
          },
          "sNo": {
            "label": "#",
            "display": true,
            "width": "10"
          },
          "rate": {
            "label": "Rate/ Item",
            "display": true,
            "width": "10"
          },
          "showVariantImage": {
            "label": "Display Image",
            "display": true,
            "width": "15"
          },
          "taxableValue": {
            "label": "Taxable Amt.",
            "display": true,
            "width": "10"
          },
          "previousDue": {
            "label": "Previous Due",
            "display": true,
            "width": null
          },
          "description": {
            "label": "Some label",
            "display": true,
            "width": "10"
          },
          "discount": {
            "label": "Dis./ Item",
            "display": true,
            "width": "10"
          },
          "taxes": {
            "label": "Taxes",
            "display": true,
            "width": "10"
          },
          "displayBaseCurrency": {
            "label": "",
            "display": true,
            "width": null
          },
          "showDescriptionInRows": {
            "label": "",
            "display": true,
            "width": null
          },
          "amountBeforeDiscount": {
            "label": "Total Before Dis.",
            "display": true,
            "width": null
          },
          "hsnSac": {
            "label": "HSN/SAC",
            "display": true,
            "width": "10"
          },
          "otherTaxBifurcation": {
            "label": "TCS",
            "display": true,
            "width": null
          },
          "totalQuantity": {
            "label": "Total Quantity",
            "display": true,
            "width": null
          }
        }
      }
    },
    "font": "Inter",
    "topMargin": 10,
    "leftMargin": 10,
    "rightMargin": 10,
    "bottomMargin": 10,
    "logoPosition": "center/left/right",
    "logoSize": "small/medium/large",
    "logoUniqueName": null,
    "copyFrom": "gst_template_a",
    "templateColor": "#AB1F00",
    "tableColor": "#f2f3f4",
    "templateType": "gst_template_a",
    "name": "",
    "fontLarge": 17
  }
  @Input() public logoSrc: string;
  @Input() public imageSignatureSrc: string;
  @Input() public showImageSignature: boolean;
  @Input() public templateUISectionVisibility: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
  /* This will hold the value if Gst Composition will show/hide */
  // @Input() public showGstComposition: boolean = true;
  @Input() public showGstComposition: boolean = true;
  @Input() public voucherType: string;
  @Output() public sectionName: EventEmitter<string> = new EventEmitter();
  public companySetting$: Observable<any> = observableOf(null);
  public companyAddress: string = '';
  // public columnsVisibled: number;
  public columnsVisibled: number = 13;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public dollarSymbol = '$';
  public isBaseCurrencyRupee = true;
  public rupeeSymbol = '&#8377';
  /* This will hold active company*/
  // @Input() public activeCompany: any;
  public activeCompany: any = {
    "headQuarterAlias": "AAA",
    "planVersion": 2,
    "name": "AAAAE-invoiced",
    "address": "Testing",
    "country": "India",
    "subscription": {
      "upgrade": false,
      "totalCompanies": 1000,
      "totalTransactions": 0,
      "userDetails": {
        "name": "Kriti Jain",
        "uniqueName": "kriti@giddh.com",
        "email": "kriti@giddh.com",
        "signUpOn": "19-09-2019 12:09:36",
        "mobileno": "916264224839"
      },
      "subscriptionStatus": "EXPIRED",
      "overdraftTransactions": 0,
      "transactionsRemaining": 0,
      "country": {
        "countryName": "India",
        "countryCode": "IN",
        "alpha3CountryCode": "IND"
      },
      "duration": "YEARLY",
      "region": {
        "name": "India",
        "code": "IND"
      },
      "status": "inactive",
      "subscriptionId": "SUB-20240508-11",
      "balance": 10000,
      "startedAt": "08-05-2024",
      "expiry": "23-05-2025",
      "createdAt": "08-05-2024 09:14:57",
      "billsRemaining": 958,
      "invoicesRemaining": 639,
      "totalInvoices": 1000,
      "totalBills": 1000,
      "planDetails": {
        "countries": [
          "India"
        ],
        "name": "Plan - Kriti",
        "currency": {
          "code": "INR",
          "symbol": "₹"
        },
        "monthlyBillsAllowed": 2,
        "archiveStatus": "UNARCHIVED",
        "amount": 0,
        "description": "This is a testing discount",
        "createdAt": "12-05-2024 18:23:41",
        "monthlyInvoicesAllowed": 2,
        "monthlyAmount": 0,
        "yearlyAmount": 1000,
        "yearlyDiscount": {
          "name": "PER disc",
          "value": 20,
          "type": "PERCENTAGE",
          "duration": 1,
          "archiveStatus": "UNARCHIVED",
          "isActive": 0,
          "expiryDate": "31-05-2024",
          "uniqueName": "lgq1715261785570",
          "period": "BOTH"
        },
        "uniqueName": "j071713271577374",
        "companiesLimit": 1,
        "monthlyCompaniesLimit": 1,
        "isCommonPlan": true,
        "invoicesAllowed": 2,
        "billsAllowed": 2,
        "restrictedModules": {}
      },
      "addOnTransactions": 0,
      "companyCount": 1000,
      "remainingTransactions": 0,
      "additionalCharges": 0,
      "paymentPending": false
    },
    "businessType": "Registered",
    "userEntityRoles": [
      {
        "duration": null,
        "from": null,
        "allowedIps": [],
        "allowedCidrs": [],
        "to": null,
        "role": {
          "name": "View",
          "isFixed": true,
          "scopes": [
            {
              "name": "SEARCH",
              "permissions": [
                {
                  "code": "VW"
                }
              ]
            },
            {
              "name": "RECURRING_ENTRY",
              "permissions": [
                {
                  "code": "VW"
                }
              ]
            },
            {
              "name": "MANAGE",
              "permissions": [
                {
                  "code": "VW"
                }
              ]
            },
            {
              "name": "AUDIT_LOGS",
              "permissions": [
                {
                  "code": "VW"
                }
              ]
            },
            {
              "name": "DASHBOARD",
              "permissions": [
                {
                  "code": "VW"
                }
              ]
            },
            {
              "name": "INVOICE",
              "permissions": [
                {
                  "code": "VW"
                }
              ]
            },
            {
              "name": "INVENTORY",
              "permissions": [
                {
                  "code": "VW"
                }
              ]
            },
            {
              "name": "LEDGER",
              "permissions": [
                {
                  "code": "VW"
                }
              ]
            },
            {
              "name": "SETTINGS",
              "permissions": [
                {
                  "code": "VW"
                }
              ]
            },
            {
              "name": "PETTY_CASH_MANAGER",
              "permissions": [
                {
                  "code": "VW"
                }
              ]
            },
            {
              "name": "REPORT",
              "permissions": [
                {
                  "code": "VW"
                }
              ]
            }
          ],
          "uniqueName": "view"
        },
        "uniqueName": "tjex1a5dkfeojc2",
        "period": null,
        "sharedWith": {
          "name": "Dilpreet Singh Dang",
          "email": "dilpreet@walkover.in",
          "uniqueName": "dilpreet@walkover.in",
          "mobileNo": "919713536143",
          "isVerified": true,
          "hasSubscriptionPermission": false
        },
        "sharedBy": {
          "name": "Dilpreet Singh Dang",
          "email": "dilpreet@whozzat.com",
          "uniqueName": "dilpreet@whozzat.com",
          "mobileNo": "9753536143",
          "isVerified": true,
          "hasSubscriptionPermission": false
        },
        "entity": {
          "uniqueName": "sales",
          "name": "Sales",
          "entity": "ACCOUNT"
        }
      },
      {
        "duration": null,
        "from": null,
        "allowedIps": [],
        "allowedCidrs": [],
        "to": null,
        "role": {
          "name": "Super Admin",
          "isFixed": true,
          "scopes": [
            {
              "name": "INTEGRATION",
              "permissions": [
                {
                  "code": "DLT"
                },
                {
                  "code": "VW"
                },
                {
                  "code": "ADD"
                },
                {
                  "code": "UPDT"
                }
              ]
            },
            {
              "name": "INVOICE",
              "permissions": [
                {
                  "code": "CMT"
                },
                {
                  "code": "UPDT"
                },
                {
                  "code": "DLT"
                },
                {
                  "code": "GSTVW"
                },
                {
                  "code": "ADD"
                },
                {
                  "code": "SHR"
                },
                {
                  "code": "GSTFL"
                },
                {
                  "code": "VW"
                }
              ]
            },
            {
              "name": "REPORT",
              "permissions": [
                {
                  "code": "UPDT"
                },
                {
                  "code": "DLT"
                },
                {
                  "code": "CMT"
                },
                {
                  "code": "VW"
                },
                {
                  "code": "GSTVW"
                },
                {
                  "code": "GSTFL"
                },
                {
                  "code": "SHR"
                },
                {
                  "code": "ADD"
                }
              ]
            },
            {
              "name": "SETTINGS",
              "permissions": [
                {
                  "code": "ADD"
                },
                {
                  "code": "UPDT"
                },
                {
                  "code": "GSTFL"
                },
                {
                  "code": "VW"
                },
                {
                  "code": "CMT"
                },
                {
                  "code": "DLT"
                },
                {
                  "code": "GSTVW"
                },
                {
                  "code": "SHR"
                }
              ]
            },
            {
              "name": "SHARE",
              "permissions": [
                {
                  "code": "SHRALL"
                },
                {
                  "code": "SHRSM"
                },
                {
                  "code": "SHRLWR"
                }
              ]
            },
            {
              "name": "INVENTORY",
              "permissions": [
                {
                  "code": "ADD"
                },
                {
                  "code": "DLT"
                },
                {
                  "code": "GSTFL"
                },
                {
                  "code": "SHR"
                },
                {
                  "code": "VW"
                },
                {
                  "code": "GSTVW"
                },
                {
                  "code": "CMT"
                },
                {
                  "code": "UPDT"
                }
              ]
            },
            {
              "name": "PETTY_CASH_MANAGER",
              "permissions": [
                {
                  "code": "CMT"
                },
                {
                  "code": "GSTFL"
                },
                {
                  "code": "UPDT"
                },
                {
                  "code": "SHR"
                },
                {
                  "code": "GSTVW"
                },
                {
                  "code": "DLT"
                },
                {
                  "code": "VW"
                },
                {
                  "code": "ADD"
                }
              ]
            },
            {
              "name": "AUDIT_LOGS",
              "permissions": [
                {
                  "code": "SHR"
                },
                {
                  "code": "VW"
                },
                {
                  "code": "ADD"
                },
                {
                  "code": "UPDT"
                },
                {
                  "code": "DLT"
                },
                {
                  "code": "GSTVW"
                },
                {
                  "code": "GSTFL"
                },
                {
                  "code": "CMT"
                }
              ]
            },
            {
              "name": "MANAGE",
              "permissions": [
                {
                  "code": "GSTVW"
                },
                {
                  "code": "UPDT"
                },
                {
                  "code": "SHR"
                },
                {
                  "code": "DLT"
                },
                {
                  "code": "CMT"
                },
                {
                  "code": "VW"
                },
                {
                  "code": "GSTFL"
                },
                {
                  "code": "ADD"
                }
              ]
            },
            {
              "name": "SEARCH",
              "permissions": [
                {
                  "code": "UPDT"
                },
                {
                  "code": "DLT"
                },
                {
                  "code": "GSTFL"
                },
                {
                  "code": "GSTVW"
                },
                {
                  "code": "CMT"
                },
                {
                  "code": "SHR"
                },
                {
                  "code": "VW"
                },
                {
                  "code": "ADD"
                }
              ]
            },
            {
              "name": "DASHBOARD",
              "permissions": [
                {
                  "code": "GSTVW"
                },
                {
                  "code": "ADD"
                },
                {
                  "code": "GSTFL"
                },
                {
                  "code": "VW"
                },
                {
                  "code": "SHR"
                },
                {
                  "code": "CMT"
                },
                {
                  "code": "DLT"
                },
                {
                  "code": "UPDT"
                }
              ]
            },
            {
              "name": "LEDGER",
              "permissions": [
                {
                  "code": "CMT"
                },
                {
                  "code": "VW"
                },
                {
                  "code": "GSTFL"
                },
                {
                  "code": "UPDT"
                },
                {
                  "code": "GSTVW"
                },
                {
                  "code": "ADD"
                },
                {
                  "code": "SHR"
                },
                {
                  "code": "DLT"
                }
              ]
            },
            {
              "name": "RECURRING_ENTRY",
              "permissions": [
                {
                  "code": "VW"
                },
                {
                  "code": "GSTFL"
                },
                {
                  "code": "ADD"
                },
                {
                  "code": "SHR"
                },
                {
                  "code": "DLT"
                },
                {
                  "code": "CMT"
                },
                {
                  "code": "GSTVW"
                },
                {
                  "code": "UPDT"
                }
              ]
            }
          ],
          "uniqueName": "super_admin"
        },
        "uniqueName": "co1qb1yu5ogxunj",
        "period": null,
        "sharedWith": {
          "name": "Dilpreet Singh Dang",
          "email": "dilpreet@walkover.in",
          "uniqueName": "dilpreet@walkover.in",
          "mobileNo": "919713536143",
          "isVerified": true,
          "hasSubscriptionPermission": false
        },
        "sharedBy": {
          "name": "Kriti Jain",
          "email": "kriti@giddh.com",
          "uniqueName": "kriti@giddh.com",
          "mobileNo": "916264224839",
          "isVerified": true,
          "hasSubscriptionPermission": false
        },
        "entity": {
          "uniqueName": "aaaain16192663354510ja2o4",
          "name": "AAAAE-invoiced",
          "entity": "COMPANY"
        }
      }
    ],
    "addresses": [
      {
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Triveni complex Rajmahal Colony",
            "mobileNumber": null,
            "alias": "Triveni complex Rajmahal Colony",
            "uniqueName": "trj1682450140149"
          }
        ],
        "name": "Without GST",
        "address": "test",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "cid1669360262309"
      },
      {
        "name": "name",
        "address": "",
        "stateCode": "JK",
        "stateName": "Jammu and Kashmir",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "bdy1692612275614"
      },
      {
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "sd",
            "mobileNumber": null,
            "alias": "sd",
            "uniqueName": "usz1696406942413"
          }
        ],
        "name": "dsadsadsa",
        "address": "",
        "stateCode": "JK",
        "stateName": "Jammu and Kashmir",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "2w21692679075670"
      },
      {
        "name": "fdfsdfds",
        "address": "",
        "stateCode": "JK",
        "stateName": "Jammu and Kashmir",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "yss1692679782183"
      },
      {
        "branches": [
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "Adjustment (Kriti)",
            "alias": "Adjustment (Kriti)",
            "uniqueName": "aaaaeinvoice8"
          }
        ],
        "name": "Divyanshu Shrivastava",
        "address": "Vijanagar",
        "stateCode": "NL",
        "stateName": "Nagaland",
        "taxType": "GSTIN",
        "taxNumber": "",
        "pincode": "452010",
        "isDefault": false,
        "uniqueName": "4vf1696833102368"
      },
      {
        "branches": [
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "Adjustment (Kriti)",
            "alias": "Adjustment (Kriti)",
            "uniqueName": "aaaaeinvoice8"
          }
        ],
        "name": "Divyanshu Shrivastavadasd",
        "address": "Satyam Vihar",
        "stateCode": "CH",
        "stateName": "Chandigarh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "pincode": "452011",
        "isDefault": false,
        "uniqueName": "jpf1696833110870"
      },
      {
        "name": "Divyanshu Shrivastava",
        "address": "Vijanagar",
        "stateCode": "PB",
        "stateName": "Punjab",
        "taxType": "GSTIN",
        "taxNumber": "",
        "pincode": "452010",
        "isDefault": false,
        "uniqueName": "v0r1696833165888"
      },
      {
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "DSDS",
            "mobileNumber": null,
            "alias": "DSDS",
            "uniqueName": "dn51716987182692"
          }
        ],
        "name": "dsd",
        "address": "efrer",
        "stateCode": "HP",
        "stateName": "Himachal Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "pincode": "332322",
        "isDefault": false,
        "uniqueName": "t6l1704534757763"
      },
      {
        "branches": [
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "Adjustment (Kriti)",
            "alias": "Adjustment (Kriti)",
            "uniqueName": "aaaaeinvoice8"
          },
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "Branch - Kriti",
            "alias": "Branch - Kriti",
            "uniqueName": "aaaaeinvoice5"
          }
        ],
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Hellos",
            "mobileNumber": null,
            "alias": "Hellos",
            "uniqueName": "8s41712831951373"
          }
        ],
        "name": "Divyanshu ",
        "address": "SSSSSSSSSSSS",
        "stateCode": "PB",
        "stateName": "Punjab",
        "taxType": "GSTIN",
        "taxNumber": "",
        "pincode": "484224",
        "isDefault": false,
        "uniqueName": "kyz1704721143880"
      },
      {
        "name": "Raju  Balram",
        "address": "House - 360, Sunsan Gali, Anokha Makan, Behind Anant Nagar",
        "stateCode": "MP",
        "stateName": "Madhya Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "23KJUHY3456S2A3",
        "pincode": "484224",
        "isDefault": false,
        "uniqueName": "o4w1704536631655"
      },
      {
        "name": "Dosti ",
        "address": "XXXXXXXXXXXCCCCCCCCCCC",
        "stateCode": "PB",
        "stateName": "Punjab",
        "taxType": "GSTIN",
        "taxNumber": "",
        "pincode": "202112",
        "isDefault": false,
        "uniqueName": "f3i1704536722306"
      },
      {
        "branches": [
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "Dashboard",
            "alias": "Dashboard",
            "uniqueName": "aaaaeinvoice12"
          },
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "Branch - Kriti",
            "alias": "Branch - Kriti",
            "uniqueName": "aaaaeinvoice5"
          }
        ],
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "dsdd",
            "mobileNumber": null,
            "alias": "dsdd",
            "uniqueName": "vnm1717077408922"
          }
        ],
        "name": "sasa",
        "address": "Vijanagar",
        "stateCode": "HP",
        "stateName": "Himachal Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "pincode": "452010",
        "isDefault": false,
        "uniqueName": "16s1704548075788"
      },
      {
        "name": "New Bengali",
        "address": "",
        "stateCode": "MP",
        "stateName": "Madhya Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "c5l1712831904913"
      },
      {
        "name": "sds",
        "address": "",
        "stateCode": "HP",
        "stateName": "Himachal Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "03o1712833230905"
      },
      {
        "name": "dsds",
        "address": "s",
        "stateCode": "CH",
        "stateName": "Chandigarh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "suv1712833281107"
      },
      {
        "name": "xzx",
        "address": "sas",
        "stateCode": "HP",
        "stateName": "Himachal Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "hiw1712833492075"
      },
      {
        "name": "sass",
        "address": "",
        "stateCode": "PB",
        "stateName": "Punjab",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "1wk1712833506058"
      },
      {
        "name": "Developer",
        "address": "",
        "stateCode": "JK",
        "stateName": "Jammu and Kashmir",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "l4u1712833666333"
      },
      {
        "name": "dsdd",
        "address": "",
        "stateCode": "PB",
        "stateName": "Punjab",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "x081712833813364"
      },
      {
        "name": "sdsd",
        "address": "aa",
        "stateCode": "HP",
        "stateName": "Himachal Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "3821712835622533"
      },
      {
        "branches": [
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "dsdd1",
            "alias": "dsdd1",
            "uniqueName": "aaaaeinvoice18"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "AAAA1",
            "alias": "AAAA1",
            "uniqueName": "ksd"
          },
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "AAA",
            "alias": "AAA",
            "uniqueName": "aaaa"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "jjj",
            "alias": "jjj",
            "uniqueName": "aaaaeinvoice22"
          },
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "New branch",
            "alias": "New branch",
            "uniqueName": "aaaaeinvoice4"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "dsdad",
            "alias": "dsdad",
            "uniqueName": "aaaaeinvoice19"
          }
        ],
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "dsdad warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "dsdad warehouse",
            "uniqueName": "tgw1718184241179"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "jjj warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "jjj warehouse",
            "uniqueName": "ruu1726843381879"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "AAAA1 warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "AAAA1 warehouse",
            "uniqueName": "g3e1726914380081"
          }
        ],
        "name": "asas",
        "address": "",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "5p71712833400928"
      },
      {
        "branches": [
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "sumit",
            "alias": "sumit",
            "uniqueName": "aaaaeinvoice2"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "Dilpreet Multi-currency",
            "alias": "Dilpreet Multi-currency",
            "uniqueName": "aaaaeinvoice7"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "Sales/purchase register",
            "alias": "Sales/purchase register",
            "uniqueName": "aaaaeinvoice9"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "GST",
            "alias": "GST",
            "uniqueName": "aaaaeinvoice3"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "Round off",
            "alias": "Round off",
            "uniqueName": "aaaaeinvoice10"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "New branch",
            "alias": "New branch",
            "uniqueName": "aaaaeinvoice4"
          },
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "Branch - Kriti",
            "alias": "Branch - Kriti",
            "uniqueName": "aaaaeinvoice5"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "kk",
            "alias": "kk",
            "uniqueName": "aaaaeinvoice"
          }
        ],
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Dilpreet warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "Dilpreet warehouse",
            "uniqueName": "73b1653479619274"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Adjustment (Kriti) warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "Adjustment (Kriti) warehouse",
            "uniqueName": "3i11656655070425"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "KK warehouse 2",
            "mobileNumber": null,
            "alias": "KK warehouse 2",
            "uniqueName": "kqd1643612601106"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "sumit warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "sumit warehouse",
            "uniqueName": "uox1644898313624"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "xyz warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "xyz warehouse",
            "uniqueName": "7t71642620058254"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "ware",
            "mobileNumber": null,
            "alias": "ware",
            "uniqueName": "8g41643085956808"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "AAAA warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "AAAA warehouse",
            "uniqueName": "7i21619266379404"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Warehouse",
            "mobileNumber": "91-1234567890",
            "alias": "Warehouse",
            "uniqueName": "aj51619548968906"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Palasia",
            "mobileNumber": "91-1234567890",
            "alias": "Palasia",
            "uniqueName": "qnv1619548967256"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "kk warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "kk warehouse",
            "uniqueName": "v4q1641936128950"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Warehouse 2",
            "mobileNumber": "91-1234567890",
            "alias": "Warehouse 2",
            "uniqueName": "ag81619548969840"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "New branch warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "New branch warehouse",
            "uniqueName": "t351645799385534"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Branch - Kriti warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "Branch - Kriti warehouse",
            "uniqueName": "m1s1648444695190"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Round off warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "Round off warehouse",
            "uniqueName": "j3q1677843369626"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Dilpreet Multi-currency warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "Dilpreet Multi-currency warehouse",
            "uniqueName": "vjv1656073614544"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Warehouse 3",
            "mobileNumber": "91-1234567890",
            "alias": "Warehouse 3",
            "uniqueName": "71w1619548972726"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Vijanagar",
            "mobileNumber": null,
            "alias": "Vijanagar",
            "uniqueName": "ucz1686203417499"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "xyz warehouse 1",
            "mobileNumber": null,
            "alias": "xyz warehouse 1",
            "uniqueName": "i0q1643127096771"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "GST warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "GST warehouse",
            "uniqueName": "aec1645710289422"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Kittu warehouse",
            "mobileNumber": null,
            "alias": "Kittu warehouse",
            "uniqueName": "xeq1637658211493"
          }
        ],
        "name": "Ravinder Singh",
        "address": "Testing 3",
        "stateCode": "MP",
        "stateName": "Madhya Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "23MKJNH3434A2Z1",
        "pincode": "452001",
        "isDefault": true,
        "uniqueName": "bf61663585984145"
      },
      {
        "name": "hfjhgjhg",
        "address": "",
        "stateCode": "JK",
        "stateName": "Jammu and Kashmir",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "8rm1713258750567"
      },
      {
        "name": "Dilpreet SIngh",
        "address": "UP",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "4ac1713264669370"
      },
      {
        "name": "scsca",
        "address": "",
        "stateCode": "HP",
        "stateName": "Himachal Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "h431714112283924"
      },
      {
        "name": "dsda",
        "address": "",
        "stateCode": "JK",
        "stateName": "Jammu and Kashmir",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "daw1714112331783"
      },
      {
        "name": "dgdffff",
        "address": "",
        "stateCode": "PB",
        "stateName": "Punjab",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "wp51714112374003"
      },
      {
        "name": "ffff",
        "address": "ff",
        "stateCode": "HP",
        "stateName": "Himachal Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "dbw1714112386711"
      },
      {
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "New Boss",
            "mobileNumber": null,
            "alias": "New Boss",
            "uniqueName": "aup1717235656522"
          }
        ],
        "name": "Developer",
        "address": "",
        "stateCode": "JK",
        "stateName": "Jammu and Kashmir",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "vdi1714123895956"
      },
      {
        "name": "Default Address",
        "address": "",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "8qk1714133621671"
      },
      {
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "RED",
            "mobileNumber": null,
            "alias": "RED",
            "uniqueName": "4aq1741113593317"
          }
        ],
        "name": "Default Address",
        "address": "",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "v841714134554180"
      },
      {
        "name": "Default Address",
        "address": "",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "jgw1714135388945"
      },
      {
        "name": "New Branch Created",
        "address": "ssd",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "r6y1717162612624"
      },
      {
        "name": "Default Address",
        "address": "",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "tdp1714135948716"
      },
      {
        "name": "Default Address",
        "address": "",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "5jx1714136074759"
      },
      {
        "name": "Default Address",
        "address": "",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "nto1714136595233"
      },
      {
        "name": "sdads",
        "address": "dsd",
        "stateCode": "HP",
        "stateName": "Himachal Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "fmv1714140102179"
      },
      {
        "name": "sdsad",
        "address": "sd",
        "stateCode": "MP",
        "stateName": "Madhya Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "3z01714376688308"
      },
      {
        "name": "New sbs",
        "address": "dsds",
        "stateCode": "MP",
        "stateName": "Madhya Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "pincode": "123123",
        "isDefault": false,
        "uniqueName": "k1l1714376780246"
      },
      {
        "name": "sass",
        "address": "s",
        "stateCode": "JK",
        "stateName": "Jammu and Kashmir",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "i1d1714377489089"
      },
      {
        "branches": [
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "dsdad",
            "alias": "dsdad",
            "uniqueName": "aaaaeinvoice19"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "Dilpreet",
            "alias": "Dilpreet ",
            "uniqueName": "dilpreet"
          },
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "Branch - Kriti",
            "alias": "Branch - Kriti",
            "uniqueName": "aaaaeinvoice5"
          }
        ],
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Dilpreet  warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "Dilpreet  warehouse",
            "uniqueName": "whe1729067101429"
          }
        ],
        "name": "csadsa",
        "address": "dsd",
        "stateCode": "JK",
        "stateName": "Jammu and Kashmir",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "jin1714387520148"
      },
      {
        "name": "dfdd",
        "address": "dsdd",
        "stateCode": "DL",
        "stateName": "Delhi",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "1vr1714387695575"
      },
      {
        "name": "dsd",
        "address": "ds",
        "stateCode": "PB",
        "stateName": "Punjab",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "gzt1714387712113"
      },
      {
        "name": "ss",
        "address": "ds",
        "stateCode": "HP",
        "stateName": "Himachal Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "5041714387729333"
      },
      {
        "name": "yyyyy",
        "address": "yyyy",
        "stateCode": "HP",
        "stateName": "Himachal Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "i8o1714387761862"
      },
      {
        "name": "tttttt",
        "address": "ttttt",
        "stateCode": "TR",
        "stateName": "Tripura",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "3ft1714387790751"
      },
      {
        "branches": [
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "iiguggu",
            "alias": "iiguggu",
            "uniqueName": "aaaaeinvoice24"
          },
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "AAA",
            "alias": "AAA",
            "uniqueName": "aaaa"
          },
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "dsdad",
            "alias": "dsdad",
            "uniqueName": "aaaaeinvoice19"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "AAAA",
            "alias": "AAAA",
            "uniqueName": "walk2prince"
          }
        ],
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "AAAA warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "AAAA warehouse",
            "uniqueName": "zop1726914124405"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "iiguggu warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "iiguggu warehouse",
            "uniqueName": "23e1726913169549"
          }
        ],
        "name": "Default Address",
        "address": "",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "mj41714635647921"
      },
      {
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "gfhgjf",
            "mobileNumber": null,
            "alias": "gfhgjf",
            "uniqueName": "zvz1717075524905"
          }
        ],
        "name": "Default Address",
        "address": "",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "ico1714635656518"
      },
      {
        "name": "Default Address",
        "address": "",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "f8e1714635937282"
      },
      {
        "name": "New Address Mera",
        "address": "sddadasd",
        "stateCode": "JK",
        "stateName": "Jammu and Kashmir",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "23v1715072209865"
      },
      {
        "name": "fsffsff",
        "address": "sad",
        "stateCode": "TR",
        "stateName": "Tripura",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "q7n1715072276144"
      },
      {
        "name": "sas",
        "address": "sa",
        "stateCode": "UT",
        "stateName": "Uttarakhand",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "tw71718180785126"
      },
      {
        "branches": [
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "Branch - Kriti",
            "alias": "Branch - Kriti",
            "uniqueName": "aaaaeinvoice5"
          }
        ],
        "name": "Sfdfas",
        "address": "",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "cyz1718178270715"
      },
      {
        "branches": [
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "Branch - Kriti",
            "alias": "Branch - Kriti",
            "uniqueName": "aaaaeinvoice5"
          }
        ],
        "name": "Manushya",
        "address": "dsqdsqda asd sad sadsad",
        "taxType": "GSTIN",
        "taxNumber": "",
        "pincode": "494332",
        "isDefault": false,
        "uniqueName": "xtf1718178343020"
      },
      {
        "branches": [
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "ashiash -23453123",
            "alias": "ashiash -23453123",
            "uniqueName": "aaaaeinvoice15"
          },
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "Branch - Kriti",
            "alias": "Branch - Kriti",
            "uniqueName": "aaaaeinvoice5"
          }
        ],
        "name": "Divyanshu",
        "address": "dsds d",
        "taxType": "GSTIN",
        "taxNumber": "",
        "pincode": "123456",
        "isDefault": false,
        "uniqueName": "sa71718178651612"
      },
      {
        "branches": [
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "Branch - Kriti",
            "alias": "Branch - Kriti",
            "uniqueName": "aaaaeinvoice5"
          }
        ],
        "name": "ffaf",
        "address": "q",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "b1e1718179057746"
      },
      {
        "name": "Neww",
        "address": "ddsds",
        "stateCode": "JK",
        "stateName": "Jammu and Kashmir",
        "taxType": "GSTIN",
        "taxNumber": "",
        "pincode": "123123",
        "isDefault": false,
        "uniqueName": "1gf1718180465010"
      },
      {
        "branches": [
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "Branch - Kriti",
            "alias": "Branch - Kriti",
            "uniqueName": "aaaaeinvoice5"
          }
        ],
        "name": "sssss",
        "address": "",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "v6l1718180761845"
      },
      {
        "branches": [
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "Branch - Kriti",
            "alias": "Branch - Kriti",
            "uniqueName": "aaaaeinvoice5"
          }
        ],
        "name": "dsad",
        "address": "",
        "stateCode": "JK",
        "stateName": "Jammu and Kashmir",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "s2i1718180991888"
      },
      {
        "branches": [
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "Branch - Kriti",
            "alias": "Branch - Kriti",
            "uniqueName": "aaaaeinvoice5"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "DSD",
            "alias": "DSD",
            "uniqueName": "aaaaeinvoice20"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "WALK",
            "alias": "WALK",
            "uniqueName": "aaaaeinvoice23"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "dsdd1",
            "alias": "dsdd1",
            "uniqueName": "aaaaeinvoice18"
          },
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "dsdad",
            "alias": "dsdad",
            "uniqueName": "aaaaeinvoice19"
          }
        ],
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "dsdd1 warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "dsdd1 warehouse",
            "uniqueName": "dec1718184209413"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "DSD warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "DSD warehouse",
            "uniqueName": "rnu1726128860084"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "WALK warehouse",
            "mobileNumber": "91-9789766432",
            "alias": "WALK warehouse",
            "uniqueName": "utv1726912682564"
          }
        ],
        "name": "dasd",
        "address": "",
        "stateCode": "JK",
        "stateName": "Jammu and Kashmir",
        "taxType": "GSTIN",
        "taxNumber": "",
        "isDefault": false,
        "uniqueName": "fff1718181143299"
      },
      {
        "warehouses": [
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "dsds",
            "mobileNumber": null,
            "alias": "dsds",
            "uniqueName": "r3g1694851378721"
          },
          {
            "countryCode": "IN",
            "currencyCode": "INR",
            "isDefault": true,
            "callingCode": null,
            "name": "Default ke alawa ek or warehouse",
            "mobileNumber": null,
            "alias": "Default ke alawa ek or warehouse",
            "uniqueName": "z1m1677585843337"
          }
        ],
        "name": "Dilpreet - Tax1",
        "address": "serets",
        "stateCode": "MP",
        "stateName": "Madhya Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "23KJUHY3456S2A3",
        "pincode": "484001",
        "isDefault": false,
        "uniqueName": "3wm1674483285371"
      },
      {
        "branches": [
          {
            "isDefault": false,
            "isHeadQuarter": false,
            "name": "AAAA",
            "alias": "AAAA",
            "uniqueName": "walk2prince"
          },
          {
            "isDefault": true,
            "isHeadQuarter": false,
            "name": "AAA",
            "alias": "AAA",
            "uniqueName": "aaaa"
          }
        ],
        "name": "testing address",
        "address": "test",
        "stateCode": "MP",
        "stateName": "Madhya Pradesh",
        "taxType": "GSTIN",
        "taxNumber": "23MNJHB2332A3Z3",
        "isDefault": false,
        "uniqueName": "73y1733482443911"
      },
      {
        "name": "Dilpreet -Address",
        "address": "Indore",
        "stateCode": "MH",
        "stateName": "Maharashtra",
        "taxType": "GSTIN",
        "taxNumber": "27GJBPS3366F2ZX",
        "pincode": "452001",
        "isDefault": false,
        "uniqueName": "2cf1751272172336"
      }
    ],
    "createdBy": {
      "name": "rodiye3925@tlhao86.com",
      "email": "rodiye3925@tlhao86.com",
      "uniqueName": "rodiye3925@tlhao86.com",
      "isVerified": true,
      "hasSubscriptionPermission": false
    },
    "contactNo": "91-9789766432",
    "city": "",
    "createdAt": "18-07-2026 18:12:53",
    "updatedAt": "01-08-2025 12:51:14",
    "voucherVersion": 2,
    "balanceDecimalPlaces": 4,
    "balanceDisplayFormat": "IND_COMMA_SEPARATED",
    "currencyDisplayFormat": "CODE",
    "ledgerView": "T_VIEW",
    "portalDomain": "aaaae-invoice",
    "withPay": false,
    "withHeldTax": 6,
    "purchaseAsPayment": true,
    "salesAsReceipt": true,
    "uniqueName": "aaaain16192663354510ja2o4",
    "businessNature": "Food",
    "nameAlias": "Walkover's",
    "baseCurrency": "INR",
    "updatedBy": {
      "name": "Dilpreet Singh Dang",
      "email": "dilpreet@walkover.in",
      "uniqueName": "dilpreet@walkover.in",
      "mobileNo": "919713536143",
      "isVerified": true,
      "hasSubscriptionPermission": false
    },
    "archiveStatus": "UNARCHIVED",
    "ecommerceDetails": [
      {
        "uniqueName": "hph1674124687298",
        "ecommerceType": {
          "name": "shopify"
        }
      },
      {
        "uniqueName": "ue11635771882883",
        "ecommerceType": {
          "name": "shopify"
        }
      },
      {
        "uniqueName": "k0s1693469731239",
        "ecommerceType": {
          "name": "shopify"
        }
      },
      {
        "uniqueName": "nk81693472599947",
        "ecommerceType": {
          "name": "shopify"
        }
      }
    ],
    "subTrialOrCancelled": false,
    "paymentPending": false,
    "companyIdentity": [],
    "financialYears": [
      {
        "financialYearStarts": "01-04-2025",
        "financialYearEnds": "31-03-2026",
        "isLocked": false,
        "uniqueName": "FY-APR2025-MAR2026"
      },
      {
        "financialYearStarts": "01-04-2024",
        "financialYearEnds": "31-03-2025",
        "isLocked": false,
        "uniqueName": "FY-APR2024-MAR2025"
      },
      {
        "financialYearStarts": "01-04-2023",
        "financialYearEnds": "31-03-2024",
        "isLocked": false,
        "uniqueName": "FY-APR2023-MAR2024"
      },
      {
        "financialYearStarts": "01-04-2022",
        "financialYearEnds": "31-03-2023",
        "isLocked": false,
        "uniqueName": "FY-APR2022-MAR2023"
      },
      {
        "financialYearStarts": "01-04-2021",
        "financialYearEnds": "31-03-2022",
        "isLocked": false,
        "uniqueName": "FY-APR2021-MAR2022"
      },
      {
        "financialYearStarts": "01-04-2020",
        "financialYearEnds": "31-03-2021",
        "isLocked": false,
        "uniqueName": "FY-APR2020-MAR2021"
      },
      {
        "financialYearStarts": "01-04-2019",
        "financialYearEnds": "31-03-2020",
        "isLocked": false,
        "uniqueName": "FY-APR2019-MAR2020"
      },
      {
        "financialYearStarts": "01-04-2018",
        "financialYearEnds": "31-03-2019",
        "isLocked": false,
        "uniqueName": "FY-APR2018-MAR2019"
      },
      {
        "financialYearStarts": "16-07-2017",
        "financialYearEnds": "16-07-2018",
        "isLocked": false,
        "uniqueName": "FY-JULY2017-JULY2018"
      },
      {
        "financialYearStarts": "16-07-2016",
        "financialYearEnds": "15-07-2017",
        "isLocked": false,
        "uniqueName": "FY-JULY2016-JULY2017"
      },
      {
        "financialYearStarts": "17-07-2015",
        "financialYearEnds": "15-07-2016",
        "isLocked": false,
        "uniqueName": "FY-JULY2015-JULY2016"
      }
    ],
    "baseCurrencySymbol": "₹",
    "countryV2": {
      "alpha3CountryCode": "IND",
      "alpha2CountryCode": "IN",
      "countryName": "India",
      "callingCode": "91",
      "currency": {
        "code": "INR",
        "symbol": "₹"
      },
      "europeanUnionCountry": false
    },
    "hasCounty": false,
    "activeFinancialYear": {
      "uniqueName": "FY-APR2025-MAR2026",
      "isLocked": false,
      "financialYearStarts": "01-04-2025",
      "financialYearEnds": "31-03-2026"
    }
  };
  /** Holds images folder path */
  public imgPath: string = "";
  /** Holds the value if company is Indian */
  public isIndianCompany: boolean = true;

  constructor(
    @Inject(ServiceConfig) private serviceConfig,
    private store: Store<AppState>,
    private settingsProfileActions: SettingsProfileActions) {
    this.companySetting$ = this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.isIndianCompany = this.activeCompany?.countryV2?.countryName === CountryNames.INDIA;
    this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
    this.companySetting$.subscribe(a => {
      if (a && a.address) {
        this.companyAddress = cloneDeep(a.address);
      } else if (!a) {
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
      }
    });
  }

  public onClickSection(sectionName: string) {
    if (!this.isPreviewMode) {
      this.sectionName.emit(sectionName);
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public ngOnChanges(changes: SimpleChanges) {
    // if ((changes.fieldsAndVisibility && changes.fieldsAndVisibility.previousValue && changes.fieldsAndVisibility.currentValue !== changes.fieldsAndVisibility.previousValue) || changes.fieldsAndVisibility && changes.fieldsAndVisibility.firstChange) {
    //     this.columnsVisibled = 0;
    //     if (changes.fieldsAndVisibility.currentValue.table) {
    //         if (changes.fieldsAndVisibility.currentValue.table.sNo && changes.fieldsAndVisibility.currentValue.table.sNo?.display) {
    //             this.columnsVisibled++;
    //         }
    //         if ((changes.fieldsAndVisibility.currentValue.table.item && changes.fieldsAndVisibility.currentValue.table.item?.display) || (changes.fieldsAndVisibility.currentValue.table.date && changes.fieldsAndVisibility.currentValue.table.date?.display)) {
    //             this.columnsVisibled++;
    //         }
    //         if (changes.fieldsAndVisibility.currentValue.table.hsnSac && changes.fieldsAndVisibility.currentValue.table.hsnSac?.display) {
    //             this.columnsVisibled++;
    //         }
    //         if (changes.fieldsAndVisibility.currentValue.table.quantity && changes.fieldsAndVisibility.currentValue.table.quantity?.display) {
    //             this.columnsVisibled++;
    //         }
    //         if (changes.fieldsAndVisibility.currentValue.table.rate && changes.fieldsAndVisibility.currentValue.table.rate?.display) {
    //             this.columnsVisibled++;
    //         }
    //         if (changes.fieldsAndVisibility.currentValue.table.discount && changes.fieldsAndVisibility.currentValue.table.discount?.display) {
    //             this.columnsVisibled++;
    //         }
    //         if (changes.fieldsAndVisibility.currentValue.table.taxableValue && changes.fieldsAndVisibility.currentValue.table.taxableValue?.display) {
    //             this.columnsVisibled++;
    //         }
    //         if (changes.fieldsAndVisibility.currentValue.table.taxes && changes.fieldsAndVisibility.currentValue.table.taxes?.display) {
    //             this.columnsVisibled++;
    //         }
    //         if (changes?.fieldsAndVisibility?.currentValue?.table?.displayBaseCurrency && changes.fieldsAndVisibility.currentValue.table.displayBaseCurrency?.display) {
    //             this.columnsVisibled++;
    //         }
    //         if (this.columnsVisibled) {
    //             this.columnsVisibled++;
    //             this.columnsVisibled++;
    //             this.columnsVisibled++;
    //             this.columnsVisibled++;
    //         }
    //     }
    // }
  }

}
