import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { Ng2BootstrapModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2BootstrapModule.forRoot()
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
