import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable, ReplaySubject, take, takeUntil } from 'rxjs';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { GeneralService } from '../../services/general.service';
import { OrganizationType } from '../../models/user-login-state';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { GstReconcileService } from '../../services/gst-reconcile.service';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { VatService } from '../../services/vat.service';
import { ToasterService } from '../../services/toaster.service';
import { FileReturnComponent } from '../file-return/file-return.component';
import { ViewReturnComponent } from '../view-return/view-return.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

export interface ObligationsStatus {
    label: string;
    value: '' | 'F' | 'O';
}
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
        private gstReconcileService: GstReconcileService,
        private formBuilder: UntypedFormBuilder,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private vatService: VatService,
        private toaster: ToasterService,
        private modalService: BsModalService,
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
