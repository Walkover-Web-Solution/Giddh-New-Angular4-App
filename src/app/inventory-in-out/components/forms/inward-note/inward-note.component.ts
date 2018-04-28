import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'inward-note',
  templateUrl: './inward-note.component.html',
  styles: [`

  `],
})

export class InwardNoteComponent implements OnInit {
  @Output() public onCancel = new EventEmitter();
  public form: FormGroup;
  public config: Partial<BsDatepickerConfig> = {dateInputFormat: 'DD-MM-YYYY'};

  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      date: [''],
      productName: [''],
      description: ['']
    });
  }

  public ngOnInit() {
    //
  }

}
