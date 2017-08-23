import { Injectable } from "@angular/core";
import {Subject} from "rxjs/Subject";
import {
  IsDivVisible,
  IsFieldVisible
} from "../invoice/templates/edit-template/filters-container/content-filters/content.filters.component";

@Injectable()

export class InvoiceUiDataService {
  public logoPath: Subject<string> = new Subject();
  public imageSignaturePath: Subject<string> = new Subject();
  public setDivVisible: Subject<IsDivVisible> = new Subject();
  public setFieldDisplay: Subject<IsFieldVisible> = new Subject();

  public setLogoPath(val) {
    console.log('The value is :', val);
    this.logoPath.next(val);
  }

  public setImageSignatgurePath(val) {
    console.log('The value is :', val);
    this.imageSignaturePath.next(val);
  }

  public setDivStatus(div: IsDivVisible) {
    this.setDivVisible.next(div);
  }

  public setFieldDisplayState(field: IsFieldVisible) {
    this.setFieldDisplay.next(field);
  }
}
