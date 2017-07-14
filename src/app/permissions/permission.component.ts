import {
    Component,
    OnInit,
    ViewChild,
    ComponentFactoryResolver
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { ModalDirective } from 'ngx-bootstrap';
import { GroupWithAccountsAction } from '../services/actions/groupwithaccounts.actions';
import { ElementViewContainerRef } from '../shared/helpers/directives/element.viewchild.directive';
import { CompanyActions } from '../services/actions/company.actions';
import { Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { PermissionActions } from '../services/actions/permission.actions';


@Component({
    selector: 'permissions',
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {

    @ViewChild(ElementViewContainerRef) public elementViewContainerRef: ElementViewContainerRef;
    @ViewChild('permissionModel') public permissionModel: ModalDirective;

    public localState: any;
    public allRoles: object;
    constructor(
        private store: Store<AppState>,
        public route: ActivatedRoute,
        private companyActions: CompanyActions,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver,
        private permissionService: PermissionService,
        private permissionActions: PermissionActions
    ) { }

    public ngOnInit() {
        this.route
            .data
            .subscribe((data: any) => {
                /**
                 * Your resolved data from route.
                 */
                this.localState = data.yourData;
            });

        console.log('hello `Permission` component');
        /**
         * static data that is bundled
         * var mockData = require('assets/mock-data/mock-data.json');
         * console.log('mockData', mockData);
         * if you're working with mock data you can also use http.get('assets/mock-data/mock-data.json')
         */
        this.asyncDataWithWebpack();

        this.permissionModel.onHidden.subscribe(e => {
            this.store.dispatch(this.groupWithAccountsAction.resetAddAndMangePopup());
        });

        // this.permissionService
        //     .GetAllRoles('').subscribe(response => this.allRoles = response.body); //call this service in @Effect only

        this.store.take(1).subscribe(store => {
            if (store.permission === null) {
                this.store.dispatch(this.permissionActions.getAllRoles(this.allRoles)); // It is not storing data
            }
        });
    }
    private asyncDataWithWebpack() {
        /**
         * you can also async load mock data with 'es6-promise-loader'
         * you would do this if you don't want the mock-data bundled
         * remember that 'es6-promise-loader' is a promise
         */
        setTimeout(() => {

            System.import('../../assets/mock-data/mock-data.json')
                .then((json) => {
                    console.log('async mockData', json);
                    this.localState = json;
                });

        });
    }

    //
    private openPermissionModal() {
        console.log("Permission model will open now.");
        this.permissionModel.show();
    }

    private hidePermissionModel() {
        this.permissionModel.hide();
    }

    public closePopupEvent() {
        this.permissionModel.hide();
    }
}
