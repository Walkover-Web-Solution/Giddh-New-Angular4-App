export interface IContent {
  display: boolean;
  label: string;
  field: string;
  width: string;
}

export interface ISection {
  sectionName: string;
  content: IContent[];
}

export interface ITemplateBody {
  sections: ISection[];
  isDefault: boolean;
  uniqueName: string;
  sample: boolean;
  name: string;
}

export interface ITemplate {
  status: string;
  body: ITemplateBody[];
}
