import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { MatAccordion } from "@angular/material/expansion";
import { MatDialog } from "@angular/material/dialog";
import { SubscriptionsActions } from '../../../actions/userSubscriptions/subscriptions.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { BsModalRef } from 'ngx-bootstrap/modal';


export interface PeriodicElement {
    consumed: number;
    balance: number;
    dues: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { consumed: 2000, balance: 8000, dues: '₹500' },
    { consumed: 6, balance: 14, dues: '₹4,000' },
    { consumed: 6, balance: 14, dues: '₹2,000' },
];

@Component({
    selector: 'subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss']
})

export class SubscriptionComponent implements OnInit {

    // This will change the search bar height dynamically
    public menuBarHeight: Number = 40;
    public menuOneWidth: Number;
    public menuTwoWidth: Number;
    // This will change the rowspan of main content and oak plan list dynamically
    public sideBarBoxLength: Number = 15;
    public sideBarBoxWidth: Number;
    public mainContentWidth: Number;
    // This will change the height of oak plan list dynamically
    public rowLength: Number = 180;
    // This will change the length of overall summary box dynamically
    public overallSummaryTopRow: Number = 6;
    public overallSummaryBottomRow: Number = 4;
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild("moveCompany", { static: false }) public moveCompany: any;
    public modalRef: BsModalRef;

    constructor(public dialog: MatDialog, public breakpointObserver: BreakpointObserver, private subscriptionsActions: SubscriptionsActions, private store: Store<AppState>) { }

    public imgPath: string = '';
    public ngOnInit(): void {
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.breakpointObserver.observe([
            '(min-width: 768px)',
            '(min-width: 1024px)',
            '(min-width: 1536px)'
        ]).subscribe((state: BreakpointState) => {

            if (state.breakpoints['(min-width: 768px)']) {
                        this.rowLength = 120;
                //         this.menuBarHeight = 5.5;
                //         this.sideBarBoxLength = 13;
                this.sideBarBoxWidth = 5;
                this.mainContentWidth = 11;
                this.menuOneWidth = 5;
                this.menuTwoWidth = 11;
            }
            if (state.breakpoints['(min-width: 1024px)']) {
                this.rowLength = 120;
                this.menuBarHeight = 40;
                this.sideBarBoxLength = 15;
                this.overallSummaryTopRow = 5;
                this.overallSummaryBottomRow = 3;
                this.sideBarBoxWidth = 4;
                this.mainContentWidth = 12;
                this.menuOneWidth = 4;
                this.menuTwoWidth = 12;
            }
            if (state.breakpoints['(min-width: 1536px)']) {
                this.rowLength = 150;
                this.menuBarHeight = 40;
                this.sideBarBoxLength = 15;
                this.overallSummaryTopRow = 6;
                this.overallSummaryBottomRow = 4;
                this.sideBarBoxWidth = 4;
                this.mainContentWidth = 12;
                this.menuOneWidth = 4;
                this.menuTwoWidth = 12;
            }
        })
    }

    displayedColumns: string[] = ['consumed', 'balance', 'dues'];
    dataSource = ELEMENT_DATA;

    openDialog() {
        const dialogRef = this.dialog.open(this.moveCompany, { height: '50%', width: '40%' });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }
    /**
   * This function will refresh the subscribed companies if move company was succesful and will close the popup
   *
   * @param {*} event
   * @memberof SubscriptionsComponent
   */
    public addOrMoveCompanyCallback(event): void {
        if (event === true) {
            this.store.dispatch(this.subscriptionsActions.SubscribedCompanies());
        }
        // this.modalRef.hide();
    }
}