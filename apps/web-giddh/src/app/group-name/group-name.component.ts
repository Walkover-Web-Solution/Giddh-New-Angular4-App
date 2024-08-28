import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";

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
  /** This will use for instance of warehouses Dropdown */
  public branchesDropdown: UntypedFormControl = new UntypedFormControl();
  /** Thsi will use for searching for stock */
  public productNameSearching: UntypedFormControl = new UntypedFormControl();
  public addAccountForm: UntypedFormGroup;


  constructor() { }

  public ngOnInit(): void {
    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
  }

}
