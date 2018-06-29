import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '../../../../services/toaster.service';
import { SettingsBunchService } from '../../../../services/settings.bunch.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'add-bunch-company',
  templateUrl: './bunch-add-company.component.html',
  styleUrls: ['./bunch-add-company.component.css']
})

export class BunchAddCompanyModalComponent implements OnChanges {

  @Input() public activeBunch: string = null;
  @Input() public companiesList: any[] = [];

  @Output() public closeModalEvent: EventEmitter<boolean> = new EventEmitter(false);
  @Output() public saveDataEvent: EventEmitter<any> = new EventEmitter(null);

  public isAllCompanySelected: boolean = false;

  constructor(private _fb: FormBuilder,
  private _toaster: ToasterService,
  private _settingsBunchService: SettingsBunchService,
  ) {

  }

  public selectAllPages(event) {
    if (event.target.checked) {
      this.isAllCompanySelected = true;
      this.companiesList.forEach((item) => item.isSelected = true);
    } else {
      this.isAllCompanySelected = false;
      this.companiesList.forEach((item) => item.isSelected = false);
    }
  }

  /**
   * save
   */
  public save() {
    let dataToSend = [];
    _.forEach(this.companiesList, function(obj) {
      if (obj.isSelected) {
        dataToSend.push(obj.uniqueName);
      }
    });
    this.saveDataEvent.emit(_.cloneDeep(dataToSend));
  }

  public onCancel() {
    this.closeModalEvent.emit(true);
  }

  /**
   * showDropdown
  //  */
  public showDropdown() {
    //
  }

  /**
   * hideDropdown
   */
  public hideDropdown() {
    //
  }

  /**
   * ngOnChanges
   */
  public ngOnChanges(s) {
    //
  }
}
