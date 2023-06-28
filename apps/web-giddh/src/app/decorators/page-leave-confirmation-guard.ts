import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { PageLeaveUtilityService } from '../services/page-leave-utility.service';

export interface ComponentCanDeactivate {
    canDeactivate: () => Promise<boolean> | boolean;
}

@Injectable()
export class PageLeaveConfirmationGuard implements CanDeactivate<ComponentCanDeactivate> {
    constructor(
        private pageLeaveUtilityService: PageLeaveUtilityService
    ) { }

    public canDeactivate(component: any): Promise<boolean> | boolean {
        if (component?.form?.dirty) {
            return new Promise<boolean>((resolve, reject) => {
                let dialogRef = this.pageLeaveUtilityService.openDialog();

                dialogRef.afterClosed().subscribe((action) => {
                    if (action) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });
            }).catch((e) => {
                return e;
            });
        } else {
            return true;
        }
    }
}
