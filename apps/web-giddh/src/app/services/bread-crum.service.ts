import { Injectable } from "@angular/core";

export interface BreadCrumbPath {
    url: string;
    queryParams: any;
    currentPageName: string;
}

@Injectable({
    providedIn: 'root'
})
export class BreadCrumbService {
    /**
     * Stores the breadcrumb path for navigation
     */
    public breadCrumbPath: BreadCrumbPath[] = [];

    /**
     * Sets the current path on the breadcrumb path
     * @param path - The path to set
     */
    public setCurrentPathOnBreadCrumbPath(path: BreadCrumbPath) {
        this.breadCrumbPath.push(path);
        localStorage.setItem('breadCrumbPath', JSON.stringify(this.breadCrumbPath));
    }

    /**
     * Sets the breadcrumb path
     * @param path - The path to set
     */
    public setBreadCrumbPath(path: BreadCrumbPath[]) {
        localStorage.setItem('breadCrumbPath', JSON.stringify(path));
        this.breadCrumbPath = path;
    }

    /**
     * Gets the breadcrumb path
     * @returns The breadcrumb path
     */
    public getBreadCrumbPath(): BreadCrumbPath[] {
        return JSON.parse(localStorage.getItem('breadCrumbPath')) || [];
    }
}
