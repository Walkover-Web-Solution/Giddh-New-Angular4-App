import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject} from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GeneralService } from '../../services/general.service';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { GstReconcileService } from '../../services/gst-reconcile.service';
import { FormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { VatService } from '../../services/vat.service';
import { ToasterService } from '../../services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
    public asideGstSidebarMenuState: string = 'in';
    /** Holds With Held Form control */
    public taxPercentage: FormControl = new FormControl(6, [Validators.required]);


    constructor(
        private store: Store<AppState>,
        private generalService: GeneralService,
        private vatService: VatService,
        private toaster: ToasterService,
        public dialog: MatDialog,
        private route: Router
    ) {

    }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof WithHeldSettingComponent
    */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');
    }

    public changeTaxPercentage(): void {
        console.log(this.taxPercentage.value);
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
        this.asideGstSidebarMenuState === 'out'
    }
}
