import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { INameUniqueName } from '../models/interfaces/nameUniqueName.interface';
import * as _ from 'lodash';

@Component({
  styles: [`
    .grey-bg{
      background-color: #f4f5f8;
      padding: 20px;
    }
  `],
  templateUrl: './sales.component.html'
})
export class SalesComponent {
  constructor(
    private router: Router
  ) {
    console.log('hello from SalesComponent');
  }
}
