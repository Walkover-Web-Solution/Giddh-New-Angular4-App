import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import * as jsPDF from 'jspdf';
import { DataFormatter, IFormatable } from './data-formatter.class';
import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';
import { RecTypePipe } from '../../../shared/helpers/pipes/recType/recType.pipe';
import { CompanyResponse } from '../../../models/api-models/Company';
import { ChildGroup } from '../../../models/api-models/Search';
import { Total } from './tb-export-csv.component';
import 'jspdf-autotable';
import { JsPDFAutoTable } from '../../../../customTypes/jsPDF/index';
import { TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';

interface GroupViewModel {
    credit: number;
    debit: number;
    closingBalance: string;
    openingBalance: string;
    uniqueName: string;
    name: string;
    parent: string;
}

class FormatPdf implements IFormatable {
    private pdf: jsPDF = new jsPDF();
    private colX: number;
    private colY: number = 20;

    constructor(private request: TrialBalanceRequest) {
        this.colX = 10;
        // this.colY = 50;
    }

    public setHeader(selectedCompany: CompanyResponse) {
        this.pdf.setFontSize(16);
        this.pdf.text(10, this.colY, selectedCompany.name);
        this.pdf.setFontSize(10);
        if (selectedCompany.address) {
            selectedCompany.address.split('\n')
                .forEach(p => this.pdf.text(10, this.colY += 5, p));
        }

        this.pdf.text(10, this.colY += 5, selectedCompany.city + '-' + selectedCompany.pincode);
        this.pdf.text(10, this.colY += 5, `Trial Balance: ${this.request.from} to ${this.request.to}`);
        this.pdf.line(10, this.colY += 5, 200, this.colY);

        this.pdf.setFontSize(9);
        this.pdf.text(10, this.colY += 5, 'PARTICULAR');
        this.pdf.text(70, this.colY, 'OPENING BALANCE');
        this.pdf.text(105, this.colY, 'DEBIT');
        this.pdf.text(140, this.colY, 'CREDIT');
        this.pdf.text(170, this.colY, 'CLOSING BALANCE');
        this.pdf.line(10, this.colY += 3, 200, this.colY);
    }

    public setRowData(data: any[], padding: number) {
        this.pdf.setFontSize(9);
        this.pdf.text(this.colX + padding, this.colY += 5, data[0].toString());
        this.pdf.text(70, this.colY, data[1].toString());
        this.pdf.text(105, this.colY, data[2].toString());
        this.pdf.text(140, this.colY, data[3].toString());
        this.pdf.text(170, this.colY, data[4].toString());
        if (this.colY > 247) {
            this.pdf.addPage();
            this.colY = 20;
        }
    }

    public setFooter(data: any[]) {
        this.pdf.setFontSize(10);
        this.pdf.line(10, this.colY += 5, 200, this.colY);
        this.pdf.text(10, this.colY + 5, 'TOTAL');
        this.pdf.text(70, this.colY + 5, data[0].toString());
        this.pdf.text(105, this.colY + 5, data[1].toString());
        this.pdf.text(140, this.colY + 5, data[2].toString());
        this.pdf.text(170, this.colY + 5, data[3].toString());
    }

    public save(name) {
        this.pdf.save(name);
    }
}

@Component({
    selector: 'tb-export-pdf',  // <home></home>
    template: `
      <div class="btn-group" dropdown>
        <a dropdownToggle class="cp"><img src="{{ imgPath }}"/></a>
        <ul id="dropdown-pdf" *dropdownMenu class="dropdown-menu dropdown-menu-right tbpl-dropdown" role="menu" aria-labelledby="button-basic">
            <span class="caret"></span>
            <li><a (click)="downloadPdf('group-wise')" class="cp">Group Wise
              Report</a>
            </li>
            <li><a (click)="downloadPdf('condensed')" class="cp">Condensed
              Report</a>
            </li>
            <li><a (click)="downloadPdf('account-wise')" class="cp">Account Wise
              Report</a>
            </li>
        </ul>
      </div>
    <!-- end form-group -->
  `,
    providers: [RecTypePipe]
})
export class TbExportPdfComponent implements OnInit, OnDestroy {
    @Input() public trialBalanceRequest: TrialBalanceRequest;
    @Input() public selectedCompany: CompanyResponse;
    @Output() public tbExportPdfEvent = new EventEmitter<string>();
    public enableDownload: boolean = true;
    public showPdf: boolean;
    public imgPath: string = '';
    private exportData: ChildGroup[];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private dataFormatter: DataFormatter;

    constructor(private store: Store<AppState>, private recType: RecTypePipe) {
        this.store.select(p => p.tlPl.tb.exportData).subscribe(p => {
            this.exportData = p;
            this.dataFormatter = new DataFormatter(p, this.selectedCompany, recType);
        });
    }

    public downloadPdf(value: string) {
        switch (value) {
            case 'group-wise':
                this.downloadPdfGroupWise();
                break;
            case 'condensed':
                this.downloadPdfCondensed();
                break;
            case 'account-wise':
                this.downloadPdfAccountWise();
                break;
        }
        return false;
    }

    public ngOnInit() {
        this.imgPath =  (isElectron|| isCordova)  ? 'assets/images/pdf-icon.png' : AppUrl + APP_FOLDER + 'assets/images/pdf-icon.png';
    }

    public ngOnDestroy() {
        //
    }

    private downloadPdfGroupWise() {
        this.showPdf = false;
        let pdf = new jsPDF('p', 'pt') as JsPDFAutoTable;
        let columns = [
            {
                title: 'Particular',
                dataKey: 'name'
            },
            {
                title: 'Opening Balance',
                dataKey: 'openingBalance'
            },
            {
                title: 'Debit',
                dataKey: 'debit'
            },
            {
                title: 'Credit',
                dataKey: 'credit'
            },
            {
                title: 'Closing Balance',
                dataKey: 'closingBalance'
            }
        ];
        let total: Total = {
            ob: 0,
            cb: 0,
            cr: 0,
            dr: 0
        };
        let rows: GroupViewModel[] = this.exportData
            .map(p => {
                total = this.dataFormatter.calculateTotal(p, total);
                return {
                    closingBalance: `${p.closingBalance.amount} ${this.recType.transform(p.closingBalance)}`,
                    openingBalance: `${p.forwardedBalance.amount} ${this.recType.transform(p.forwardedBalance)}`,
                    name: p.groupName + ' (' + p.uniqueName + ')',
                    credit: p.creditTotal,
                    debit: p.debitTotal
                } as GroupViewModel;
            });
        let colY = 50;
        pdf.autoTable(columns, rows, {
            theme: 'plain',
            margin: {
                top: this.selectedCompany.address ? 110 + (this.selectedCompany.address.split('\n').length * 15) : 110 + 15
            },
            drawCell: (cell, data) => {

                pdf.setFontSize(8);
                if (!isNaN(cell.raw) || cell.raw.indexOf('Cr.') > -1 || cell.raw.indexOf('Dr.') > -1) {
                    cell.text = cell.text[0] ? String(cell.raw) : [String(cell.text)];
                }
            },
            addPageContent: () => {
                pdf.setFontSize(16);
                pdf.text(40, colY, this.selectedCompany.name);
                pdf.setFontSize(10);
                if (this.selectedCompany.address) {
                    this.selectedCompany.address.split('\n')
                        .forEach(p => pdf.text(40, colY += 15, p));
                }
                pdf.text(40, colY += 15, this.selectedCompany.city + '-' + this.selectedCompany.pincode);
                pdf.text(40, colY += 15, `Trial Balance: ${this.trialBalanceRequest.from} to ${this.trialBalanceRequest.to}`);
            }
        });
        let footerX = 40;
        let lastY = pdf.autoTableEndPosY();
        let pageWidth = pdf.internal.pageSize.width - 40;
        pdf.setFontSize(8);
        pdf.line(40, lastY, pageWidth, lastY);
        pdf.text(footerX, lastY + 20, 'Total');
        pdf.text(footerX + 210, lastY + 20, total.ob.toString());
        pdf.text(footerX + 302, lastY + 20, total.dr.toString());
        pdf.text(footerX + 365, lastY + 20, total.cr.toFixed(2));
        pdf.text(footerX + 430, lastY + 20, total.cb.toFixed(2));
        // Save the PDF
        pdf.save('PdfGroupWise.pdf');
    }

    private downloadPdfCondensed() {
        //
        let formatPdf = new FormatPdf(this.trialBalanceRequest);
        this.dataFormatter.formatDataCondensed(formatPdf);
        formatPdf.save('PdfCondensed.pdf');
    }

    private downloadPdfAccountWise(): void {
        let formatPdf = new FormatPdf(this.trialBalanceRequest);
        this.dataFormatter.formatDataAccountWise(formatPdf);
        formatPdf.save('PdfAccountWise.pdf');
    }

}
