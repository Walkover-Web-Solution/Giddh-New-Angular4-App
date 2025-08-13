import { Component, OnInit, ViewChild, Input, ElementRef, SimpleChanges } from '@angular/core';
import { CustomTemplateResponse } from '../../../models/api-models/Invoice';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { TemplateContentUISectionVisibility, InvoiceUiDataService } from '../../../services/invoice.ui.data.service';
import { cloneDeep } from '../../../lodash-optimized';
import { GeneralService } from '../../../services/general.service';
import { CommonService } from '../../../services/common.service';
import { ToasterService } from '../../../services/toaster.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-select/option.interface';
import { InvoiceService } from '../../../services/invoice.service';
import { NgForm } from '@angular/forms';
import { CountryNames } from '../../../shared/Enums/common.enum';
import { CurrentCompanyState } from '../../../store/company/company.reducer';
import { TemplateModeEnum, TemplateTypeEnum } from '../../../models/api-models/Sales';

@Component({
    selector: 'template-edit-filter',
    templateUrl: './template-edit-filter.component.html',
    styleUrls: ['./template-edit-filter.component.scss'],

})
export class TemplateEditFilterComponent implements OnInit {
    /** Ng form instance of content filter component */
    @ViewChild(NgForm) templateForm: NgForm;
    /** File input element reference for logo upload */
    @ViewChild('fileInput', { static: true }) logoFile: ElementRef;
    /** Input data passed to the component */
    @Input() public dialogData: any;
    /** Current mode of the component (e.g., 'create', 'edit') */
    public templateModeEnum = TemplateModeEnum;
    /** Current template type (e.g., 'invoice', 'voucher') */
    public templateTypeEnum = TemplateTypeEnum;
    /** Current template mode (e.g., 'create', 'edit') */
    public templateMode: string;
    /** Stores the custom template response object */
    public customTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    /** True, if a logo is attached */
    public logoAttached: boolean = false;
    /** True, if logo should be displayed */
    public showLogo: boolean = true;
    /** Unique name of the selected template */
    public selectedTemplateUniqueName: string = TemplateTypeEnum.GstTemplateA;
    /** List of preset font options */
    public templateFonts = [
        { label: 'Open Sans', value: 'Open Sans' },
        { label: 'Roboto', value: 'Roboto' },
        { label: 'Lato', value: 'Lato' },
        { label: 'Inter', value: 'Inter' }
    ];
    /** List of preset font size options */
    public templateFontsSize = [
        { label: '16px', value: 16 },
        { label: '14px', value: 14 },
        { label: '12px', value: 12 },
        { label: '10px', value: 10 }
    ];
    /** Available image sizes for selection */
    public imageSizes = [
        { label: 'S', value: 'S', px: '60' },
        { label: 'M', value: 'M', px: '80' },
        { label: 'L', value: 'L', px: '100' }
    ];
    /** True, if file has been uploaded */
    public isFileUploaded: boolean = false;
    /** True, if file upload is in progress */
    public isFileUploadInProgress: boolean = false;
    /** List of sample templates */
    public sampleTemplates: any[] = [];
    /** Unique name of the company */
    public companyUniqueName: string = '';
    /** Type of the template */
    public templateType: any;
    /** Emits when the component is destroyed */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True, if delete button should be shown */
    public showDeleteButton: boolean = false;
    /** Name of the selected font */
    public selectedFont: string = "";
    /** Size of the selected font */
    public selectedFontSize: string = "";
    /** Default image size */
    public defaultImageSize: string = 'S';
    /** Controls visibility of template UI sections */
    public templateSectionsVisible: TemplateContentUISectionVisibility = new TemplateContentUISectionVisibility();
    /** True, if company name should be shown */
    public showCompanyName: boolean;
    /** Stores fields and their visibility settings */
    public sectionSettings: any;
    /** Type of the voucher */
    public voucherType = '';
    /** Source URL of the signature image */
    public signatureSrc: string = '';
    /** True, if signature image is attached */
    public signatureImgAttached: boolean = false;
    /** True, if signature upload is in progress */
    public isSignatureUploadInProgress: boolean = false;
    /** True, if company country supports other tax (TCS/TDS) */
    public isTcsTdsApplicable: boolean;
    /** True, if GST composition should be shown */
    public showGstComposition: boolean = false;
    /** Stores the active company name */
    public activeCompanyName: string;
    /** Stores the voucher API version of company */
    public voucherApiVersion: 1 | 2;
    /** Holds the value if company is Indian */
    public isIndianCompany: boolean = false;
    /** Hold list of suggestion items for Tribute.js */
    public suggestionList: any[] = [];
    /** Default template */
    public templateObj: any = {
        sampleTemplates: null,
        customCreatedTemplates: null,
        defaultTemplate: {
            createdBy: null,
            fontSize: 14,
            fontSmall: 10,
            fontDefault: 14,
            isDefault: false,
            fontMedium: 12,
            isDefaultForVoucher: false,
            showSectionsInline: false,
            uniqueName: TemplateTypeEnum.GstTemplateA,
            createdAt: '',
            updatedAt: '',
            updatedBy: null,
            showBankQrCode: false,
            qrCodeId: "",
            sections: {
                footer: {
                    data: {
                        totalTax: {
                            label: 'Total Tax*',
                            display: true,
                            width: null
                        },
                        displayExportMessage: {
                            label: '',
                            display: false,
                            width: null
                        },
                        thanks: {
                            label: 'Thank You for your business.',
                            display: true,
                            width: null
                        },
                        taxableAmount: {
                            label: 'Sub Total',
                            display: true,
                            width: null
                        },
                        otherDeduction: {
                            label: '',
                            display: true,
                            width: null
                        },
                        imageSignature: {
                            label: '',
                            display: false,
                            width: null
                        },
                        grandTotal: {
                            label: 'Invoice Total',
                            display: true,
                            width: null
                        },
                        totalInWords: {
                            label: 'Invoice Total (In words)',
                            display: true,
                            width: null
                        },
                        totalDue: {
                            label: 'Total Due',
                            display: true,
                            width: null
                        },
                        companyAddress: {
                            label: '',
                            display: true,
                            width: null
                        },
                        companyName: {
                            label: '',
                            display: true,
                            width: null
                        },
                        slogan: {
                            label: '',
                            display: true,
                            width: null
                        },
                        textUnderSlogan: {
                            label: '',
                            display: true,
                            width: null
                        },
                        showNotesAtLastPage: {
                            label: '',
                            display: false,
                            width: null
                        },
                        message1: {
                            label: '',
                            display: true,
                            width: null
                        },
                        showMessage2: {
                            label: '',
                            display: true,
                            width: null
                        },
                        tcs: { // this is for template a
                            label: 'TCS',
                            display: true,
                            width: null
                        },
                        tds: { // this is for template a
                            label: 'TDS',
                            display: true,
                            width: null
                        },
                        taxBifurcation: { // this is for template a
                            label: 'Tax Bifurcation',
                            display: false,
                            width: null
                        },
                    }
                },
                header: {
                    data: {
                        shippingDate: {
                            label: 'Ship Date',
                            display: true,
                            width: null
                        },
                        showEInvoiceDetails: {
                            label: '',
                            display: false,
                            width: null
                        },
                        customField1: {
                            label: '',
                            display: true,
                            width: null
                        },
                        customField2: {
                            label: '',
                            display: true,
                            width: null
                        },
                        shippedVia: {
                            label: 'Ship Via',
                            display: true,
                            width: null
                        },
                        customField3: {
                            label: '',
                            display: true,
                            width: null
                        },
                        companyName: {
                            label: '',
                            display: true,
                            width: null
                        },
                        displayExchangeRate: {
                            label: '',
                            display: false,
                            width: null
                        },
                        displayLutNumber: {
                            label: '',
                            display: false,
                            width: null
                        },
                        displayPlaceOfSupply: {
                            label: '',
                            display: false,
                            width: null
                        },
                        displayPlaceOfCountry: {
                            label: '',
                            display: false,
                            width: null
                        },
                        dueDate: {
                            label: 'Due Date',
                            display: true,
                            width: null
                        },
                        gstComposition: {
                            label: 'Registered under Composition Scheme',
                            display: true,
                            width: null
                        },
                        gstin: {
                            label: 'GSTIN',
                            display: true,
                            width: null
                        },
                        shippingGstin: {
                            label: 'GSTIN',
                            display: true,
                            width: null
                        },
                        voucherNumber: {
                            label: 'Voucher No.',
                            display: true,
                            width: null
                        },
                        customerEmail: {
                            label: '',
                            display: true,
                            width: null
                        },
                        invoiceNumber: {
                            label: 'Invoice No.',
                            display: true,
                            width: null
                        },
                        showQrCode: {
                            label: '',
                            display: false,
                            width: null
                        },
                        voucherDate: {
                            label: 'Voucher Date',
                            display: true,
                            width: null
                        },
                        customerMobileNumber: {
                            label: '',
                            display: true,
                            width: null
                        },
                        attentionTo: {
                            label: 'Attention To',
                            display: true,
                            width: null
                        },
                        pan: {
                            label: 'PAN',
                            display: true,
                            width: null
                        },
                        trackingNumber: {
                            label: 'Tracking No.',
                            display: true,
                            width: null
                        },
                        formNameInvoice: {
                            label: 'INVOICE',
                            display: true,
                            width: null
                        },
                        billingGstin: {
                            label: 'GSTIN',
                            display: true,
                            width: null
                        },
                        address: {
                            label: '',
                            display: true,
                            width: null
                        },
                        billingState: {
                            label: 'State',
                            display: true,
                            width: null
                        },
                        invoiceDate: {
                            label: 'Invoice Date',
                            display: true,
                            width: null
                        },
                        customerName: {
                            label: '',
                            display: true,
                            width: null
                        },
                        formNameTaxInvoice: {
                            label: 'TAX INVOICE',
                            display: true,
                            width: null
                        },
                        shippingAddress: {
                            label: 'Shipping Address',
                            display: true,
                            width: null
                        },
                        shippingState: {
                            label: 'State',
                            display: true,
                            width: null
                        },
                        billingAddress: {
                            label: 'Billing Address',
                            display: true,
                            width: null
                        },
                        warehouseAddress: {
                            label: '',
                            display: true,
                            width: null
                        },
                        showCompanyAddress: {
                            label: '',
                            display: true,
                            width: null
                        },
                    }
                },
                table: {
                    data: {
                        date: {
                            label: 'Date',
                            display: true,
                            width: '10'
                        },
                        item: {
                            label: 'Description',
                            display: true,
                            width: '10'
                        },
                        total: {
                            label: 'Total',
                            display: true,
                            width: '10'
                        },
                        quantity: {
                            label: 'Qty.',
                            display: true,
                            width: '10'
                        },
                        sNo: {
                            label: '#',
                            display: true,
                            width: '10'
                        },
                        rate: {
                            label: 'Rate/ Item',
                            display: true,
                            width: '10'
                        },
                        showVariantImage: {
                            label: 'Display Image',
                            display: false,
                            width: '15'
                        },
                        taxableValue: {
                            label: 'Taxable Amt.',
                            display: true,
                            width: '10'
                        },
                        previousDue: {
                            label: 'Previous Due',
                            display: false,
                            width: null
                        },
                        description: {
                            label: 'Some label',
                            display: true,
                            width: '10'
                        },
                        discount: {
                            label: 'Dis./ Item',
                            display: true,
                            width: '10'
                        },
                        taxes: {
                            label: 'Taxes',
                            display: true,
                            width: '10'
                        },
                        displayBaseCurrency: {
                            label: '',
                            display: true,
                            width: null
                        },
                        showDescriptionInRows: {
                            label: '',
                            display: false,
                            width: null
                        },
                        amountBeforeDiscount: {
                            label: "Total Before Dis.",
                            display: true,
                            width: null
                        },
                        hsnSac: {
                            label: 'HSN/SAC',
                            display: true,
                            width: '10'
                        },
                        otherTaxBifurcation: {
                            label: "TCS",
                            display: true,
                            width: null
                        },
                        totalQuantity: { // this is for template e
                            label: 'Total Quantity',
                            display: true,
                            width: null
                        }
                    }
                }
            },
            font: 'Inter',
            topMargin: 10,
            leftMargin: 10,
            rightMargin: 10,
            bottomMargin: 10,
            logoPosition: 'center/left/right',
            logoSize: 'small/medium/large',
            logoUniqueName: null,
            copyFrom: 'gst_template_a',
            templateColor: '#AB1F00',
            tableColor: '#f2f3f4',
            templateType: TemplateTypeEnum.GstTemplateA,
            name: '',
        },
        hasInvoiceTemplatePermissions: true
    };
    /** Default Tally template */
    public tallyTemplateObj: any = {
        sections: {
            footer: {
                data: {
                    taxableAmount: {
                        label: "Taxable Amount",
                        display: true,
                        width: null
                    },
                    showNotesAtLastPage: {
                        label: "",
                        display: true,
                        width: null
                    },
                    tds: {
                        label: "TDS",
                        display: false,
                        width: null
                    },
                    imageSignature: {
                        label: "",
                        display: false,
                        width: null
                    },
                    showMessage2: {
                        label: "",
                        display: true,
                        width: null
                    },
                    tcs: {
                        label: "TCS",
                        display: false,
                        width: null
                    },
                    grandTotal: {
                        label: "Invoice Total",
                        display: true,
                        width: null
                    },
                    totalDue: {
                        label: "Total Due",
                        display: false,
                        width: null
                    },
                    companyName: {
                        label: "",
                        display: true,
                        width: null
                    },
                    displayExportMessage: {
                        label: "SUPPLY MEANT FOR EXPORT UNDER BOND OR LETTER OF UNDERTAKING WITHOUT PAYMENT OF INTEGRATED TAX",
                        display: true,
                        width: null
                    },
                    grandTotalInAccountsCurrency: {
                        label: "Invoice Total",
                        display: true,
                        width: null
                    },
                    totalInWordsInAccountsCurrency: {
                        label: "Invoice Total (In words)",
                        display: true,
                        width: null
                    },
                    totalTax: {
                        label: "Total Tax*",
                        display: true,
                        width: null
                    },
                    thanks: {
                        label: "",
                        display: true,
                        width: null
                    },
                    otherDeduction: {
                        label: "",
                        display: true,
                        width: null
                    },
                    taxBifurcation: {
                        label: "hsnSac",
                        display: true,
                        width: null
                    },
                    totalInWords: {
                        label: "Invoice Total (In words)",
                        display: true,
                        width: null
                    },
                    companyAddress: {
                        label: "",
                        display: true,
                        width: null
                    },
                    textUnderSlogan: {
                        label: "",
                        display: true,
                        width: null
                    },
                    slogan: {
                        label: "",
                        display: true,
                        width: null
                    },
                    message1: {
                        label: "We declare that this invoice shows the actual price of the services rendered and that all particulars are true and correct.",
                        display: true,
                        width: null
                    }
                }
            },
            header: {
                data: {
                    warehouseAddress: {
                        label: null,
                        display: false,
                        width: null
                    },
                    shippingDate: {
                        label: "Ship Date",
                        display: true,
                        width: null
                    },
                    customField1: {
                        label: "",
                        display: true,
                        width: null
                    },
                    customField2: {
                        label: "",
                        display: true,
                        width: null
                    },
                    shippedVia: {
                        label: "Ship Via",
                        display: true,
                        width: null
                    },
                    customField3: {
                        label: "",
                        display: true,
                        width: null
                    },
                    companyName: {
                        label: "",
                        display: true,
                        width: null
                    },
                    dueDate: {
                        label: "Due Date",
                        display: true,
                        width: null
                    },
                    displayExchangeRate: {
                        label: "Exchange/Conversion Rate",
                        display: true,
                        width: null
                    },
                    gstin: {
                        label: "GSTIN",
                        display: true,
                        width: null
                    },
                    displayPlaceOfSupply: {
                        label: "Place Of Supply",
                        display: true,
                        width: null
                    },
                    displayPlaceOfCountry: {
                        label: "Country of Supply",
                        display: true,
                        width: null
                    },
                    shippingGstin: {
                        label: "GSTIN",
                        display: true,
                        width: null
                    },
                    voucherNumber: {
                        label: "Voucher No.",
                        display: true,
                        width: null
                    },
                    customerEmail: {
                        label: "",
                        display: true,
                        width: null
                    },
                    invoiceNumber: {
                        label: "Invoice No.",
                        display: true,
                        width: null
                    },
                    showQrCode: {
                        label: null,
                        display: false,
                        width: null
                    },
                    voucherDate: {
                        label: "Voucher Date",
                        display: true,
                        width: null
                    },
                    customerMobileNumber: {
                        label: "",
                        display: true,
                        width: null
                    },
                    attentionTo: {
                        label: "Attention To",
                        display: true,
                        width: null
                    },
                    displayLutNumber: {
                        label: "LUT Number",
                        display: true,
                        width: null
                    },
                    showCompanyAddress: {
                        label: null,
                        display: false,
                        width: null
                    },
                    pan: {
                        label: "PAN",
                        display: true,
                        width: null
                    },
                    trackingNumber: {
                        label: "Tracking No.",
                        display: true,
                        width: null
                    },
                    shippingCounty: {
                        label: "County",
                        display: true,
                        width: null
                    },
                    formNameInvoice: {
                        label: "INVOICE",
                        display: true,
                        width: null
                    },
                    billingGstin: {
                        label: "GSTIN",
                        display: true,
                        width: null
                    },
                    showEInvoiceDetails: {
                        label: "",
                        display: false,
                        width: null
                    },
                    address: {
                        label: "",
                        display: true,
                        width: null
                    },
                    billingState: {
                        label: "State",
                        display: true,
                        width: null
                    },
                    invoiceDate: {
                        label: "Invoice Date",
                        display: true,
                        width: null
                    },
                    customerName: {
                        label: "",
                        display: true,
                        width: null
                    },
                    formNameTaxInvoice: {
                        label: "TAX INVOICE",
                        display: true,
                        width: null
                    },
                    shippingAddress: {
                        label: "Shipping Address",
                        display: true,
                        width: null
                    },
                    shippingState: {
                        label: "State",
                        display: true,
                        width: null
                    },
                    billingAddress: {
                        label: "Billing Address",
                        display: true,
                        width: null
                    },
                    billingCounty: {
                        label: "County",
                        display: true,
                        width: null
                    },
                    gstComposition: {
                        label: "Register under composition scheme",
                        display: false,
                        width: null
                    }
                }
            },
            table: {
                data: {
                    date: {
                        label: "Date",
                        display: true,
                        width: "10"
                    },
                    displayBaseCurrency: {
                        label: "",
                        display: true,
                        width: null
                    },
                    item: {
                        label: "Description",
                        display: true,
                        width: "10"
                    },
                    quantity: {
                        label: "Qty.",
                        display: true,
                        width: "10"
                    },
                    otherTaxBifurcation: {
                        label: "Tax",
                        display: true,
                        width: null
                    },
                    showDescriptionInRows: {
                        label: "",
                        display: true,
                        width: ""
                    },
                    description: {
                        label: "Some label",
                        display: true,
                        width: "10"
                    },
                    discount: {
                        label: "Dis./ Item",
                        display: true,
                        width: "10"
                    },
                    taxes: {
                        label: "Taxes",
                        display: true,
                        width: "10"
                    },
                    hsnSac: {
                        label: "HSN/SAC",
                        display: true,
                        width: "10"
                    },
                    total: {
                        label: "Total",
                        display: true,
                        width: "10"
                    },
                    totalQuantity: {
                        label: "totalQuantity",
                        display: false,
                        width: null
                    },
                    showVariantImage: {
                        label: "Image",
                        display: false,
                        width: null
                    },
                    sNo: {
                        label: "#",
                        display: true,
                        width: "10"
                    },
                    rate: {
                        label: "Rate/ Item",
                        display: true,
                        width: "10"
                    },
                    taxableValue: {
                        label: "Taxable Amt.",
                        display: true,
                        width: "10"
                    },
                    previousDue: {
                        label: "Previous Due",
                        display: true,
                        width: null
                    },
                    amountBeforeDiscount: {
                        label: "Total Before Dis.",
                        display: true,
                        width: null
                    },
                    skuCode: {
                        label: "SkuCode",
                        display: true,
                        width: "10"
                    }
                }
            }
        },
        fontDefault: 0,
        fontMedium: 0,
        fontSmall: 0,
        showSectionsInline: true,
        showBankQrCode: false,
        name: "Tally template",
        type: "invoice",
        templateType: "tally_template",
        copyFrom: null,
        qrCodeId: null,
        isDefaultForVoucher: false,
        templateColor: "#f63407",
        tableColor: "#ffffff",
        updatedAt: "",
        logoSize: "50",
        font: "Open Sans",
        primaryColor: "#f63407",
        secondaryColor: "#ffffff",
        topMargin: 25,
        leftMargin: 25,
        rightMargin: 25,
        bottomMargin: 25,
        fontSize: "14",
        logoUniqueName: null,
        createdAt: "",
        isDefault: false,
        logoPosition: "center/left/right",
        uniqueName: "tally_template",
        createdBy: null,
        updatedBy: null
    };
    /** Index of selected tab */
    public selectedTabIndex: number = 0;
    /** Active tab name */
    public activeTab: string;

    constructor(
        private generalService: GeneralService,
        private toasty: ToasterService,
        private commonService: CommonService,
        private store: Store<AppState>,
        private invoiceService: InvoiceService,
        private templateService: InvoiceUiDataService) {
    }

    /**
     * Angular lifecycle hook that is called after data-bound properties are initialized.
     * Initializes company, template, and UI data for the template editor.
     *
     * @memberof TemplateEditFilterComponent
     */
    public ngOnInit(): void {
        // Initialize dialog data
        const { templateType, voucherType, templateList, mode } = this.dialogData || {};
        this.templateType = templateType;
        this.voucherType = voucherType;
        this.sampleTemplates = templateList;
        this.templateMode = mode;
        this.voucherApiVersion = this.generalService.voucherApiVersion;

        // Get company info and companies list
        let companies: any = null;
        this.store.pipe(select(s => s.session), take(1)).subscribe(ss => {
            this.companyUniqueName = ss.companyUniqueName;
            companies = ss.companies;
        });

        this.templateService.setTemplateVoucherType(this.voucherType);
        if (this.templateMode === TemplateModeEnum.Create) {
            if(this.templateType !== 'purchase_order' && this.templateType !== 'purchase_bill') {
                this.templateService.initCustomTemplate(this.companyUniqueName, companies, this.templateObj.defaultTemplate);
            } else {
                this.templateService.initCustomTemplate(this.companyUniqueName, companies, this.tallyTemplateObj);
            }
        } else {
          this.templateService.initCustomTemplate(this.companyUniqueName, companies, this.dialogData.updateTemplate);
        }
        this.templateService.setIsPreviewMode(false);

        // Subscribe to active company info
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            const countryName = activeCompany?.countryV2?.countryName;
            this.showGstComposition = countryName === 'India';
            this.activeCompanyName = activeCompany?.name;
            this.isIndianCompany = countryName === CountryNames.INDIA;
        });

        // Subscribe to company state for TCS/TDS applicability
        this.store.pipe(select(appState => appState.company), takeUntil(this.destroyed$)).subscribe((companyData: CurrentCompanyState) => {
            this.isTcsTdsApplicable = companyData?.isTcsTdsApplicable;
        });

        // Subscribe to template changes
        this.templateService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
            this.customTemplate = cloneDeep(template);
            this.setFontAndFontSize();

            // Always assign sectionSettings to prevent undefined errors in the template
            this.sectionSettings = {
                header: this.customTemplate?.sections?.header?.data || {},
                table: this.customTemplate?.sections?.table?.data || {},
                footer: this.customTemplate?.sections?.footer?.data || {}
            };

            // Prepare section data
            const section = {
                header: this.customTemplate?.sections?.header?.data || {},
                table: this.customTemplate?.sections?.table?.data || {},
                footer: this.customTemplate?.sections?.footer?.data || {}
            };
            this.templateService.setFieldsAndVisibility(section);

            // Set logo size and preview
            if (this.customTemplate.logoSize) {
                this.defaultImageSize = this.customTemplate.logoSize === '100' ? 'L'
                    : this.customTemplate.logoSize === '80' ? 'M' : 'S';
            }
            if (this.customTemplate.logoUniqueName) {
                this.logoAttached = true;
                this.isFileUploaded = false;
                if (!this.templateService.isLogoUpdateInProgress) {
                    this.showDeleteButton = true;
                    const preview: any = document.getElementById('logoImage');
                    preview?.setAttribute('src', ApiUrl + 'company/' + this.companyUniqueName + '/image/' + template.logoUniqueName);
                }
            }

            // Tally template-specific logic
            if (this.customTemplate.templateType === TemplateTypeEnum.TallyTemplate) {
                const footerData = this.customTemplate.sections.footer.data;
                const headerData = this.customTemplate.sections.header.data;
                footerData.imageSignature.display = true;
                footerData.slogan.display = false;
                if (this.voucherType !== 'sales') {
                    headerData.invoiceDate.label = headerData.voucherDate.label;
                    headerData.invoiceNumber.label = headerData.voucherNumber.label;
                } else {
                    headerData.voucherDate.label = headerData.invoiceDate.label;
                    headerData.voucherNumber.label = headerData.invoiceNumber.label;
                }
            }
            this.assignImageSignature();
        });

        // Listen for logo path changes
        this.templateService.logoPath.pipe(takeUntil(this.destroyed$)).subscribe((path: string) => {
            if (!path) {
                this.showDeleteButton = false;
                this.logoAttached = false;
                this.isFileUploaded = false;
                this.defaultImageSize = 'S';
            }
        });

        // Fetch email content suggestions
        this.invoiceService.getEmailContentSuggestions('account').pipe(takeUntil(this.destroyed$)).subscribe(response => {
            const suggestions = response?.body?.accountSuggestions;
            this.suggestionList = suggestions ? suggestions.map((item: string) => ({ key: item, value: item })) : [];
        });

        // Subscribe to UI section visibility changes
        this.templateService.selectedSection.pipe(takeUntil(this.destroyed$)).subscribe((info: TemplateContentUISectionVisibility) => {
            this.templateSectionsVisible = cloneDeep(info);
        });

        // Subscribe to company name visibility changes
        this.templateService.isCompanyNameVisible.pipe(takeUntil(this.destroyed$)).subscribe((yesOrNo: boolean) => {
            this.showCompanyName = cloneDeep(yesOrNo);
        });

        // Subscribe to fields and visibility settings
        this.templateService.fieldsAndVisibility.pipe(takeUntil(this.destroyed$)).subscribe((obj) => {
            this.sectionSettings = cloneDeep(obj);
        });
    }

    /**
     * Handles value change for a given template field.
     *
     * @param {string} fieldName The name of the field to update
     * @param {string} value The new value for the field
     * @memberof TemplateEditFilterComponent
     */
    public onValueChange(fieldName: string, value: string) {
        const template = cloneDeep(this.customTemplate);
        if (fieldName) template[fieldName] = value;
        this.templateService.setCustomTemplate(template);
    }

    /**
     * Updates the primary and secondary colors of the template.
     *
     * @param {string} primaryColor The new primary color
     * @param {string} secondaryColor The new secondary color
     * @memberof TemplateEditFilterComponent
     */
    public changeColor(primaryColor: string, secondaryColor: string) {
        const template = cloneDeep(this.customTemplate);
        template.templateColor = primaryColor;
        template.tableColor = secondaryColor;
        this.templateService.setCustomTemplate(template);
    }


    /**
     * Handles design changes, either switching template or updating a specific field.
     *
     * @param {string} fieldName The name of the field or 'uniqueName' to change the template
     * @param {string} value The new value or uniqueName of the template
     * @memberof TemplateEditFilterComponent
     */
    public onDesignChange(fieldName: string, value: string): void {
        let template;
        if (fieldName === 'uniqueName') {
            const selectedTemplate = cloneDeep(this.sampleTemplates.find((t: CustomTemplateResponse) => t?.uniqueName === value));
            template = selectedTemplate || cloneDeep(this.customTemplate);
            if (this.templateMode === TemplateModeEnum.Update && selectedTemplate) {
                template.uniqueName = this.customTemplate?.uniqueName;
                template.name = this.customTemplate.name;
            }
        } else {
            template = cloneDeep(this.customTemplate);
            template[fieldName] = value;
        }
        template.copyFrom = value;
        this.selectedTemplateUniqueName = value;
        template.sections['header'].data['companyName'].label = this.activeCompanyName;
        template.sections['footer'].data['companyName'].label = this.activeCompanyName;
        this.templateService.setCustomTemplate(cloneDeep(template));
    }

    /**
     * Resets print margin settings to their default values.
     *
     * @memberof TemplateEditFilterComponent
     */
    public resetPrintSetting(): void {
        const template = cloneDeep(this.customTemplate);
        template.topMargin = template.bottomMargin = template.leftMargin = template.rightMargin = 10;
        this.customTemplate = cloneDeep(template);
        this.setFontAndFontSize();
        this.onValueChange(null, null);
    }

    /**
     * Handles font selection for the template.
     *
     * @param {IOption} font The selected font option
     * @memberof TemplateEditFilterComponent
     */
    public onFontSelect(font: IOption): void {
        this.onValueChange('font', font?.value);
    }

    /**
     * Handles font size selection for the template.
     *
     * @param {IOption} fontSize The selected font size option
     * @memberof TemplateEditFilterComponent
     */
    public onFontSizeSelect(fontSize: IOption): void {
        if (!fontSize?.value) {
            const template = cloneDeep(this.customTemplate);
            this.onValueChange('fontSize', template.fontSize);
        } else {
            this.onValueChange('fontSize', fontSize.value);
        }
    }

    /**
     * Uploads a logo image for the template and updates the UI accordingly.
     *
     * @memberof TemplateEditFilterComponent
     */
    public uploadLogo(): void {
        const selectedFile: any = document.getElementById("logo-edit");
        if (selectedFile?.files?.length) {
            const file = selectedFile.files[0];
            this.generalService.getSelectedFile(file, (blob, fileObj) => {
                this.isFileUploadInProgress = true;
                this.templateService.isLogoUpdateInProgress = true;
                this.previewFile(fileObj);
                this.commonService.uploadFile({ file: blob, fileName: fileObj.name })
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe(response => {
                        this.isFileUploadInProgress = false;
                        if (response?.status === 'success') {
                            this.showDeleteButton = true;
                            this.onValueChange('logoUniqueName', response.body?.uniqueName);
                            this.isFileUploaded = true;
                            this.templateService.isLogoUpdateInProgress = false;
                            this.toasty.successToast('File uploaded successfully.');
                        } else {
                            this.toasty.showSnackBar("error", response.message);
                        }
                    });
            });
        }
    }

    /**
     * Replaces new line characters with <br /> tags in specific template fields.
     *
     * @param {*} template The template object to update
     * @returns {*} The updated template object
     * @memberof TemplateEditFilterComponent
     */
    public newLineToBR(template: any): any {
        const footerData = template.sections?.footer?.data;
        if (footerData) {
            if (footerData['message1']?.label) footerData['message1'].label = footerData['message1'].label.replace(/(?:\r\n|\r|\n)/g, '<br />');
            if (footerData['companyAddress']?.label) footerData['companyAddress'].label = footerData['companyAddress'].label.replace(/(?:\r\n|\r|\n)/g, '<br />');
            if (footerData['slogan']?.label) footerData['slogan'].label = footerData['slogan'].label.replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
        return template;
    }

    /**
     * Previews the selected logo file and updates the preview image in the UI.
     *
     * @param {*} file The file object to preview
     * @memberof TemplateEditFilterComponent
     */
    public previewFile(file: any): void {
        const preview: any = document.getElementById('logoImage');
        const reader = new FileReader();
        reader.onloadend = () => {
            preview.src = reader.result;
            this.templateService.setLogoPath(preview.src);
        };
        if (file) {
            reader.readAsDataURL(file);
            this.logoAttached = true;
        } else {
            preview.src = '';
            this.logoAttached = false;
            this.templateService.setLogoPath('');
        }
    }

    /**
     * Toggles the visibility of the logo in the template.
     *
     * @param {boolean} [show] Optional flag to explicitly set visibility
     * @memberof TemplateEditFilterComponent
     */
    public toogleLogoVisibility(show?: boolean): void {
        if (!this.isFileUploaded) {
            this.showLogo = show ?? !this.showLogo;
            this.templateService.setLogoVisibility(this.showLogo);
        }
    }

    /**
     * Deletes the logo from the template and resets related UI state.
     *
     * @memberof TemplateEditFilterComponent
     */
    public deleteLogo(): void {
        this.onValueChange('logoUniqueName', null);
        this.templateService.setLogoPath('');
        this.logoAttached = false;
        this.isFileUploaded = false;
        this.isFileUploadInProgress = false;
        this.showDeleteButton = false;
        this.logoFile?.nativeElement && (this.logoFile.nativeElement.value = "");
    }

    /**
     * Validates and restricts the print margin settings.
     *
     * @param {number} val The margin value
     * @param {number} idx The index for the margin position
     * @param {string} marginPosition The margin position (top, left, bottom, right)
     * @memberof TemplateEditFilterComponent
     */
    public validatePrintSetting(val: number, idx: number, marginPosition: string): void {
        const paddingCordinatesValue = [200, 200, 200, 200];
        const paddingCordinates = ['Top', 'Left', 'Bottom', 'Right'];
        if (val > paddingCordinatesValue[idx]) {
            const maxVal = paddingCordinatesValue[idx];
            this.customTemplate[marginPosition] = maxVal;
            this.templateService.setCustomTemplate(this.customTemplate);
            this.toasty.errorToast(`${paddingCordinates[idx]} margin cannot be more than ${paddingCordinatesValue[idx]}`);
        }
    }

    /**
     * Sets the selected font and font size based on the template data.
     *
     * @memberof TemplateEditFilterComponent
     */
    public setFontAndFontSize(): void {
        if (!this.customTemplate) return;
        if (this.customTemplate.font) {
            if (this.customTemplate.templateType === TemplateTypeEnum.TallyTemplate) {
                this.templateFonts = [
                    { label: 'Open Sans', value: 'Open Sans' },
                    { label: 'Roboto', value: 'Roboto' }
                ];
            }
            this.templateFonts.forEach(font => {
                if (font?.value === this.customTemplate.font) this.selectedFont = font.label;
            });
        }
        if (this.customTemplate.fontSize) {
            this.templateFontsSize.forEach(fontSize => {
                if (fontSize?.value == this.customTemplate.fontSize) this.selectedFontSize = fontSize.label;
            });
        }
    }


    /**
     * Handles the visibility change of a design field.
     *
     * @param {string} fieldName The name of the field
     * @param {string} value The value to set for the field
     * @memberof TemplateEditFilterComponent
     */
    public onChangeDesignFieldVisibility(fieldName: string, value: string): void {
        const template = cloneDeep(this.customTemplate);
        if (fieldName) template[fieldName] = value;
        this.templateService.setCustomTemplate(template);
    }

    /**
     * Angular lifecycle hook that is called when the component is destroyed. Releases memory and cleans up subscriptions.
     *
     * @memberof TemplateEditFilterComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Shows a warning message when attempting to change the template type in update mode.
     *
     * @memberof TemplateEditFilterComponent
     */
    public showMessage(): void {
        this.toasty.showSnackBar("warning", 'You can not change the template type in update mode.');
    }

    /**
     * Angular lifecycle hook called when an input property changes.
     *
     * @param {SimpleChanges} changes The changed input properties
     * @memberof TemplateEditFilterComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['content'] && changes['content'].currentValue !== changes['content'].previousValue) {
            this.signatureImgAttached = false;
            this.signatureSrc = '';
            this.assignImageSignature();
        }
    }


    /**
     * Handles field changes within a template section.
     *
     * @param {string} sectionName The name of the section
     * @param {string} fieldName The name of the field
     * @param {string} value The value to set
     * @memberof TemplateEditFilterComponent
     */
    public onFieldChange(sectionName: string, fieldName: string, value: string): void {
        let template = cloneDeep(this.customTemplate);
        this.templateService.setCustomTemplate(template);
    }

    /**
     * Toggles the display state of shipping address related fields in the template.
     *
     * @memberof TemplateEditFilterComponent
     */
    public changeDisableShipping(): void {
        let template = cloneDeep(this.customTemplate);
        if (!template.sections.header.data.shippingAddress?.display) {
            template.sections.header.data.shippingGstin.display = false;
            template.sections.header.data.shippingState.display = false;

        } else {
            template.sections.header.data.shippingGstin.display = true;
            template.sections.header.data.shippingState.display = true;
        }

        this.templateService.setCustomTemplate(template);
    }

    /**
     * Toggles the display state of billing address related fields in the template.
     *
     * @memberof TemplateEditFilterComponent
     */
    public changeDisableBilling(): void {
        let template = cloneDeep(this.customTemplate);
        if (!template.sections.header.data.billingAddress?.display) {
            template.sections.header.data.billingGstin.display = false;
            template.sections.header.data.billingState.display = false;
        } else {
            template.sections.header.data.billingGstin.display = true;
            template.sections.header.data.billingState.display = true;
        }

        this.templateService.setCustomTemplate(template);
    }

    /**
     * Handles the visibility change of a field within a section.
     *
     * @param {string} sectionName The section name
     * @param {string} fieldName The field name
     * @param {boolean} value The visibility value
     * @memberof TemplateEditFilterComponent
     */
    public onChangeFieldVisibility(sectionName: string, fieldName: string, value: boolean): void {
        let template = cloneDeep(this.customTemplate);
        this.templateService.setCustomTemplate(template);
    }

    /**
     * Toggles the visibility of the company name in the template.
     *
     * @memberof TemplateEditFilterComponent
     */
    public onChangeCompanyNameVisibility(): void {
        this.templateService.setCompanyNameVisibility(this.showCompanyName);
    }

    /**
     * Uploads signature
     *
     * @memberof ContentFilterComponent
     */
    public uploadImage(): void {
        const selectedFile: any = document.getElementById("signatureImg-edit");
        if (selectedFile?.files?.length) {
            const file = selectedFile?.files[0];

            this.generalService.getSelectedFileBase64(file, (base64) => {
                this.isSignatureUploadInProgress = true;

                this.commonService.uploadImageBase64({ base64: base64, format: file.type, fileName: file.name }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.isSignatureUploadInProgress = false;

                    if (response?.status === 'success') {
                        if (this.templateService.unusedImageSignature) {
                            this.removeFileFromServer();
                        }
                        this.signatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + response.body?.uniqueName;
                        this.customTemplate.sections.footer.data.imageSignature.label = response.body?.uniqueName;
                        this.templateService.unusedImageSignature = response.body?.uniqueName;
                        this.onChangeFieldVisibility(null, null, null);
                        this.toasty.showSnackBar("success", 'File uploaded successfully.');
                    } else {
                        this.signatureImgAttached = false;
                        this.toasty.showSnackBar("error", response.message);
                    }
                });
            });
        }
    }

    /**
     * Removes the signature image from the template.
     *
     * @memberof TemplateEditFilterComponent
     */
    public removeFile(): void {
        this.signatureImgAttached = false;
        this.customTemplate.sections.footer.data.imageSignature.label = '';
        this.templateService.setCustomTemplate(this.customTemplate);
    }

    /**
     * Permanently removes the signature file from the server.
     *
     * @memberof TemplateEditFilterComponent
     */
    public removeFileFromServer(): void {
        this.invoiceService.removeSignature(this.templateService.unusedImageSignature).subscribe(() => { });
    }

    /**
     * Chooses the signature type (slogan or image signature) for the template.
     *
     * @param {string} val The selected signature type
     * @memberof TemplateEditFilterComponent
    */
    public chooseSigntureType(val: string): void {
        let template = cloneDeep(this.customTemplate);
        if (val === 'slogan') {
            template.sections.footer.data.slogan.display = true;
            template.sections.footer.data.imageSignature.display = false;
        } else {
            template.sections.footer.data.imageSignature.display = true;
            template.sections.footer.data.slogan.display = false;
        }
        this.templateService.setCustomTemplate(template);

    }

    /**
     * Toggles the display state of the quantity and total quantity fields in the template.
     *
     * @memberof TemplateEditFilterComponent
     */
    public changeDisableQuantity(): void {
        let template = cloneDeep(this.customTemplate);
        if (template && template.sections && template.sections.table && template.sections.table.data && template.sections.table.data.totalQuantity) {
            if (!template.sections.table.data.quantity?.display) {
                template.sections.table.data.totalQuantity.display = false;
            } else {
                template.sections.table.data.totalQuantity.display = true;
            }
        }
        this.templateService.setCustomTemplate(template);
    }

    /**
     * Changes the tax bifurcation label for the specified section.
     *
     * @param {string} label The label to set
     * @param {string} sectionType The section type ('footer' or 'table')
     * @memberof TemplateEditFilterComponent
    */
    public checkedTaxBifurcation(label: string, sectionType: string): void {
        let template = cloneDeep(this.customTemplate);
        if (sectionType === 'table' && template && template.sections && template.sections.table && template.sections.table.data && template.sections.table.data.taxBifurcation) {
            if (template.sections.table.data.taxBifurcation?.display) {
                template.sections.table.data.taxBifurcation.label = label;
            } else {
                template.sections.table.data.taxBifurcation.label = '';
            }
        } else {
            if (template && template.sections && template.sections.footer && template.sections.footer.data && template.sections.footer.data.taxBifurcation) {
                if (template.sections.footer.data.taxBifurcation?.display) {
                    template.sections.footer.data.taxBifurcation.label = label;
                } else {
                    template.sections.footer.data.taxBifurcation.label = '';
                }
            }
        }

        this.templateService.setCustomTemplate(template);
    }

    /**
     * Toggles the display of the document title header.
     *
     * @param {boolean} event True if the header should be displayed
     * @memberof TemplateEditFilterComponent
     */
    public changeInvoiceHeader(event: boolean): void {
        this.customTemplate.sections['header'].data['formNameInvoice'].display = event;
    }

    /**
     * Assigns the image signature for CREATE and UPDATE flows.
     *
     * @memberof TemplateEditFilterComponent
     */
    public assignImageSignature(): void {
        if (this.customTemplate?.sections?.footer?.data?.imageSignature?.label) {
            this.signatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + this.customTemplate.sections.footer.data.imageSignature.label;
            this.signatureImgAttached = true;
        } else {
            this.signatureSrc = '';
            this.signatureImgAttached = false;
        }
    }

    /**
     * Change voucher number or date based on Invoice number or date
     *
     * @param {boolean} [isDate=true] True, if date is changed
     * @memberof TemplateEditFilterComponent
     */
    public handleInvoiceDateNumberChange(isDate: boolean = true): void {
        if (isDate) {
            this.customTemplate.sections['header'].data['voucherDate'].label = this.customTemplate.sections['header'].data['invoiceDate'].label;
            this.customTemplate.sections['header'].data['voucherDate'].display = this.customTemplate.sections['header'].data['invoiceDate'].display;
        } else {
            this.customTemplate.sections['header'].data['voucherNumber'].label = this.customTemplate.sections['header'].data['invoiceNumber'].label;
            this.customTemplate.sections['header'].data['voucherNumber'].display = this.customTemplate.sections['header'].data['invoiceNumber'].display;
        }
    }

    /**
     * Handles tab change
     *
     * @param {*} event
     * @memberof TemplateEditFilterComponent
     */
    public tabChanged(event: any): void {
        this.selectedTabIndex = event.index;
        this.templateService.setIsPreviewMode(event?.index === 1 ? true : false);
    }

}