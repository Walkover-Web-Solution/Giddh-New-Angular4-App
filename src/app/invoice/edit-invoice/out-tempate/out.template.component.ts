import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges
} from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { Store} from '@ngrx/store';
import { AppState} from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';


@Component({
  selector: 'invoice-template',

  templateUrl: 'out.template.component.html',
  styleUrls: ['out.template.component.css']
})

export class OutTemplateComponent implements OnInit {
  @Input() public templateId: string = 'template1';
  @Input() public heading: string;
  constructor( private store: Store<AppState>) {
    console.log('out-template-component constructor called');
  }

  public ngOnInit() {
    console.log('out-template-component initialised');

  }
}
