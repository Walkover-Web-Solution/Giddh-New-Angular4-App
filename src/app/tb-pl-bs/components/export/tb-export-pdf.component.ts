import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as jsPDF from 'jspdf';
import { DataFormatter, IFormatable } from './data-formatter.class';
import { AppState } from '../../../store/roots';
import { Store } from '@ngrx/store';
import { RecTypePipe } from '../../../shared/helpers/pipes/recType.pipe';
import { ComapnyResponse } from '../../../models/api-models/Company';
import { ChildGroup } from '../../../models/api-models/Search';
import { Total } from './tb-export-csv.component';
import 'jspdf-autotable';
import { JsPDFAutoTable } from '../../../../customTypes/jsPDF/index';

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
  private colY: number;

  constructor() {
    this.colX = 10;
    this.colY = 50;
  }

  public setHeader(selectedCompany: ComapnyResponse) {
    this.pdf.setFontSize(16);
    this.pdf.text(10, 20, selectedCompany.name);
    this.pdf.setFontSize(10);
    this.pdf.text(10, 25, selectedCompany.address);
    this.pdf.text(10, 30, selectedCompany.city + '-' + selectedCompany.pincode);
    this.pdf.text(10, 35, 'Trial Balance: ');
    this.pdf.line(10, 38, 200, 38);

    this.pdf.setFontSize(9);
    this.pdf.text(10, 43, 'PARTICULAR');
    this.pdf.text(70, 43, 'OPENING BALANCE');
    this.pdf.text(105, 43, 'DEBIT');
    this.pdf.text(140, 43, 'CREDIT');
    this.pdf.text(170, 43, 'CLOSING BALANCE');
    this.pdf.line(10, 45, 200, 45);
  }

  public setRowData(data: any[], padding: number) {
    this.pdf.setFontSize(10);
    this.pdf.text(this.colX + padding, this.colY, data[0].toString());
    this.pdf.text(70, this.colY, data[1].toString());
    this.pdf.text(105, this.colY, data[2].toString());
    this.pdf.text(140, this.colY, data[3].toString());
    this.pdf.text(170, this.colY, data[4].toString());
    if (this.colY > 247) {
      this.pdf.addPage();
      this.colY = 20;
    } else {
      this.colY += 5;
    }
  }

  public setFooter(data: any[]) {
    this.pdf.line(10, this.colY, 200, this.colY);
    this.pdf.text(10, this.colY + 5, 'TOTAL', );
    this.pdf.text(70, this.colY + 5, data[0].toString());
    this.pdf.text(105, this.colY + 5, data[1].toString());
    this.pdf.text(140, this.colY + 5, data[2].toString());
    this.pdf.text(170, this.colY + 5, data[3].toString());
  }

  public save() {
    this.pdf.save('');
  }
}

@Component({
  selector: 'tb-export-pdf',  // <home></home>
  template: `
    <div class="form-group pdf-export" (clickOutside)="showPdf=false;">
      <a (click)="showPdf = !showPdf" *ngIf="enableDownload"><img
        src="/assets/images/pdf-icon.png"/></a>
      <div class="export-options" *ngIf="showPdf">
        <span class="arrow"></span>
        <ul class="list-unstyled">
          <li><a (click)="downloadPdf('group-wise')">Group Wise
            Report</a></li>
          <li><a (click)="downloadPdf('condensed')">Condensed
            Report</a></li>
          <li><a (click)="downloadPdf('account-wise')">Account Wise
            Report</a></li>
        </ul>
      </div>
    </div>
    <!-- end form-group -->
  `,
  providers: [RecTypePipe]
})
export class TbExportPdfComponent implements OnInit, OnDestroy {

  @Input() public selectedCompany: ComapnyResponse;
  @Output() public tbExportPdfEvent = new EventEmitter<string>();
  public enableDownload: boolean = true;
  public showPdf: boolean;
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
    //
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
          name: p.groupName,
          credit: p.creditTotal,
          debit: p.debitTotal
        } as GroupViewModel;
      });

    pdf.autoTable(columns, rows, {
      theme: 'plain',
      margin: {
        top: 110
      },
      drawCell: (cell, data) => {
        if (data.column.name === 'name') {
          // console.log(cell, data);
        }
      },
      addPageContent: () => {
        pdf.setFontSize(16);
        pdf.text(40, 50, this.selectedCompany.name);
        pdf.setFontSize(10);
        pdf.text(40, 65, this.selectedCompany.address);
        pdf.text(40, 80, this.selectedCompany.city + '-' + this.selectedCompany.pincode);
        pdf.text(40, 95, 'Trial Balance: ');
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
    pdf.save('Test.pdf');
  }

  private downloadPdfCondensed() {
    //
    let formatPdf = new FormatPdf();
    this.dataFormatter.formatDataCondensed(formatPdf);
    formatPdf.save();
  }

  private createPdf(rows: any, cols: any): void {
    //

  }

  private downloadPdfAccountWise(): void {
    let formatPdf = new FormatPdf();
    this.dataFormatter.formatDataAccountWise(formatPdf);
    formatPdf.save();
  }
}
