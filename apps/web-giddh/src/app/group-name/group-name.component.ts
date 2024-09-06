import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { ReplaySubject, takeUntil } from 'rxjs';
import { cloneDeep } from '../lodash-optimized';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-group-name',
  templateUrl: './group-name.component.html',
  styleUrls: ['./group-name.component.scss']
})
export class GroupNameComponent implements OnInit {
  /** True if api call in progress */
  public isLoading: boolean = false;
  public file: any = null;
  /* This will hold local JSON data */
  public localeData: any = {};
  /* This will hold common JSON data */
  public commonLocaleData: any = {};
  /** Image path variable */
  public imgPath: string = '';
  /** This will use for instance of branches Dropdown */
  public branchesDropdown: UntypedFormControl = new UntypedFormControl();
  /** Thsi will use for searching for stock */
  public productNameSearching: UntypedFormControl = new UntypedFormControl();
  public addAccountForm: UntypedFormGroup;
  /**Hold branches */
  public branches: any[] = [];
  /** Hold all branches */
  public allBranches: any[] = [];
  /** Hold branches checked  */
  public selectedBranch: any[] = [];
  /** Observable to unsubscribe all the store listeners to avoid memory leaks */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Hold all warehouses */
  public allWarehouses: any[] = [];
  /** List of warehouses */
  public warehouses: any[] = [];
  /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
  public isCompany: boolean;

  constructor(
    private generalService: GeneralService
  ) { }

  public ngOnInit(): void {
    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

    // get branches
    this.branchesDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
      let branchesClone = cloneDeep(this.allBranches);
      if (search) {
        branchesClone = this.allBranches?.filter(branch => (branch.alias?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1));
      }
      this.branches = branchesClone;
    });

    this.getBranches();
  }
      /**
       * This will be used to get branches
       *
       * @return {*}  {void}
       * @memberof GroupNameComponent
       */
      public getBranches(): void {
        if (!this.allBranches) {
          return;
      }
        this.allWarehouses = [];
        if (!this.isCompany) {
            let currentBranch = this.allBranches?.filter(branch => branch?.uniqueName === this.generalService.currentBranchUniqueName);
            this.allWarehouses = currentBranch[0]?.warehouses;
        } else {
            this.allBranches?.forEach((branches) => {
                this.allWarehouses = this.allWarehouses?.concat(branches?.warehouses);
            });
        }
     }



  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
