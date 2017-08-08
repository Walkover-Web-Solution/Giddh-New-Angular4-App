// export class Content {
//   public heading: string;
//   public para: string;
//   public GSTIN: string;
//   public PAN: string;
//   public invoiceDate: string;
//   public dueDate: string;
//   public shipDate: string;
//   public shipVia: string;
//   public trackingNo: string;
//   public invoiceNo: string;
//   public invoiceTempTitle: string;
//   public customerName: string;
//   public companyName: string;
//   public emailId: string;
//   public mobileno: string;
//   public billingAddress: string;
//   public billingGSTIN: string;
// }
//
// export class TableColumnMeta {
//   public colName: string;
//   public display: boolean;
//   public label: string;
//   public width: number;
// }

export class Template {
  public sections: Section[];
}

export class Section {
  public header: HeaderContents[];
  public table: TableContents[];
  public footer: FooterContents[];
  public isDefault: boolean;
  public uniqueName: string;
  public sample: false;
  public name: string;
}

export class HeaderContents {
 public display: boolean;
 public label: string;
 public field: string;
 public width: number;

}

export class TableContents {
  public display: boolean;
  public label: string;
  public field: string;
  public width: number;
}

export class FooterContents {
  public display: boolean;
  public label: string;
  public field: string;
  public width: number;
}
