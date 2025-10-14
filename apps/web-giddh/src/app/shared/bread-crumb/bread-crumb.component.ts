import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { filter, ReplaySubject, takeUntil } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import { BreadCrumbService } from '../../services/bread-crum.service';

@Component({
    selector: 'bread-crumb',
    standalone: true,
    imports: [CommonModule, MatIconModule, RouterModule],
    templateUrl: './bread-crumb.component.html'
})
export class BreadCrumbComponent {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private router: Router,
        public breadCrumbService: BreadCrumbService
    ) {
    }

    /**
     * Optimized method to check if any breadcrumb path URL is included in the given URL
     * @param url - The URL to check against breadcrumb paths
     * @returns boolean indicating if any breadcrumb path is found in the URL
     */
    private checkBreadCrumbPath(url: string): boolean {
        return this.breadCrumbService?.getBreadCrumbPath()?.some(path => path?.url && url.includes(path.url)) ?? false;
    }

    /**
     * Initializes the component and sets up navigation event listeners
     */
    public ngOnInit(): void {
        this.router.events.pipe(
            filter(event => (event instanceof NavigationStart && !this.checkBreadCrumbPath(event.url))),
            takeUntil(this.destroyed$)).subscribe(() => {
                this.breadCrumbService.setBreadCrumbPath([]);
            });
    }

    /**
     * Navigates to the specified URL with optional query parameters
     * @param index - The index of the breadcrumb path to navigate to
     */
    public navigateTo(index?: number): void {
        let currentPath = this.breadCrumbService.getBreadCrumbPath();
        this.breadCrumbService.setBreadCrumbPath(currentPath.slice(0, index + 1));
        this.router.navigate([currentPath[index].url], { queryParams: currentPath[index].queryParams });
    }

    /**
     * Cleanup resources on component destroy
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
