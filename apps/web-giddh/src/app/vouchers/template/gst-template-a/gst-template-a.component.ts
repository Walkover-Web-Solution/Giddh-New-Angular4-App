import { Component, Input, OnInit } from '@angular/core';
import { CustomTemplateResponse } from '../../../models/api-models/Invoice';

@Component({
  selector: 'app-gst-template-a',
  templateUrl: './gst-template-a.component.html',
  styleUrls: ['./gst-template-a.component.scss']
})
export class GstTemplateAComponent implements OnInit {
  @Input() public inputTemplate: CustomTemplateResponse = new CustomTemplateResponse();
  constructor() { }

  ngOnInit() {
  }

}
