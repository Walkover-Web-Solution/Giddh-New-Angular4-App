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

export class Section implements ISection {
  public sectionName: string;
  public content: IContent[];
}
