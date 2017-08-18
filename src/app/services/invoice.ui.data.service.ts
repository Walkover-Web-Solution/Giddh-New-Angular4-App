import { Injectable } from "@angular/core";
import {Subject} from "rxjs/Subject";

@Injectable()

export class InvoiceUiDataService {
  public logoPath: Subject<string> = new Subject();
  public imageSignaturePath: Subject<string> = new Subject();

  public setLogoPath(val) {
    alert('Worked');
    console.log('The value is :', val);
    this.logoPath.next(val);
  }

  public setImageSignatgurePath(val) {
    alert('Worked');
    console.log('The value is :', val);
    this.imageSignaturePath.next(val);
  }
}
