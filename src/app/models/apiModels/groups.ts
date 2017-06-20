export class Groups {
  public category: string;
  public groups: Groups[];
  public name: string;
  public synonyms?: string;
  public uniqueName: string;

  constructor(category: string, groups: Groups[], name: string, synonyms: string,
              uniqueName: string) {
    this.category = category;
    this.groups = groups;
    this.name = name;
    this.synonyms = synonyms;
    this.uniqueName = uniqueName;
  }
}
