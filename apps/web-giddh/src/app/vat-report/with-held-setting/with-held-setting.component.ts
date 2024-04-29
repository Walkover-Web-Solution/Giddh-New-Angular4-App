import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, take} from 'rxjs';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { FormControl, Validators } from '@angular/forms';
import { ToasterService } from '../../services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SettingsProfileService } from '../../services/settings.profile.service';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';

@Component({
    selector: 'with-held-setting-component',
    templateUrl: './with-held-setting.component.html',
    styleUrls: ['./with-held-setting.component.scss']
})

export class WithHeldSettingComponent implements OnInit, OnDestroy {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideTaxSidebarMenuState: string = 'in';
    /** Holds With Held Form control */
    public taxPercentage: FormControl = new FormControl(6, [Validators.max(100), Validators.required]);
    /** True if api call in progress */
    public isLoading: boolean = false;

    constructor(
        private settingsProfileService: SettingsProfileService,
        private toaster: ToasterService,
        public dialog: MatDialog,
        private route: Router,
        private store: Store<AppState>,
        private settingsProfileActions: SettingsProfileActions
    ) {}

    /**
    * Lifecycle hook for initialization
    *
    * @memberof WithHeldSettingComponent
    */
    public ngOnInit(): void {
        this.getWithHeldValue();
        document.querySelector('body').classList.add('gst-sidebar-open');
    }

    /**
     * Get With Held Tax Percentage value
     *
     * @private
     * @memberof WithHeldSettingComponent
     */
    private getWithHeldValue(): void {
        this.isLoading = true;
        this.settingsProfileService.getCompanyDetails(null).pipe(take(1)).subscribe((response: any) => {
            if (response?.status === "success" && response?.body?.withHeldTax) {
                this.taxPercentage.patchValue(response.body.withHeldTax);
            } else if(response?.message){
                this.toaster.showSnackBar("error", response.message);
            }
            this.isLoading = false;
        });
    }

    /**
     * Handle form submit and update 
     * With Held Tax Percentage value
     *
     * @memberof WithHeldSettingComponent
     */
    public handleFormSubmit(): void {
        const model = { withHeldTax: this.taxPercentage.value }
        this.store.dispatch(this.settingsProfileActions.PatchProfile(model));
    }

    /**
    * Handles GST Sidebar Navigation
    *
    * @memberof WithHeldSettingComponent
    */
    public handleNavigation(): void {
        this.route.navigate(['pages', 'gstfiling']);
    }

    /**
    * Lifecycle hook for destroy
    *
    * @memberof WithHeldSettingComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideTaxSidebarMenuState === 'out'
    }
}
