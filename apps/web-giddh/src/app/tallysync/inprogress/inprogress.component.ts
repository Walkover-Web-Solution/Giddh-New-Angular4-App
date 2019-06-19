import {Component, OnInit} from '@angular/core';
import {ToasterService} from "../../services/toaster.service";

@Component({
  selector: 'app-inprogress-preview',
  templateUrl: './inprogress.component.html',
  styleUrls: ['./inprogres.component.scss'],
})
export class InprogressComponent implements OnInit {
  constructor(private _toaster: ToasterService) {}

  public ngOnInit() {
    console.log("inprogress");
  }
}
