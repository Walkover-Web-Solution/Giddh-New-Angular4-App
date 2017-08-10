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

import { IContent, ISection, ITemplate, ITemplateBody } from '../interfaces/parseInvoice.interface';

export class Template implements ITemplate {
  public status: string;
  public body: ITemplateBody[];
}

export class TemplateBody implements ITemplateBody {
  public sections: ISection[];
  public  isDefault: boolean;
  public uniqueName: string;
  public sample: boolean;
  public name: string;
}

export class Section implements ISection{
  public sectionName: string;
  public content: IContent[];
}
