import { Injectable } from "@angular/core";

export interface BreadCrumbPath {
  url: string;
  queryParams?: any;
  currentPageName: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadCrumbService {
  private readonly storageKey = 'breadCrumbPath';
  public breadCrumbPath: BreadCrumbPath[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.storageKey);
    this.breadCrumbPath = stored ? JSON.parse(stored) : [];
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.breadCrumbPath));
  }

  public hasPath(url: string): boolean {
    return this.breadCrumbPath.some(p => p.url === url);
  }

  public setCurrentPathOnBreadCrumbPath(path: BreadCrumbPath): void {
    const existingIndex = this.breadCrumbPath.findIndex(p => p.url === path.url);

    if (existingIndex !== -1) {
      this.breadCrumbPath = this.breadCrumbPath.slice(0, existingIndex + 1);
    } else {
      this.breadCrumbPath.push(path);
    }

    this.saveToStorage();
  }

  public setBreadCrumbPath(path: BreadCrumbPath[]): void {
    this.breadCrumbPath = path;
    this.saveToStorage();
  }

  public getBreadCrumbPath(): BreadCrumbPath[] {
    return this.breadCrumbPath;
  }

  public clear(): void {
    this.breadCrumbPath = [];
    localStorage.removeItem(this.storageKey);
  }
}

