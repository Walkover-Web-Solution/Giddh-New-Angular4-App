import { Component, OnInit, NgModule, OnDestroy, AfterViewInit,ElementRef } from '@angular/core';
@Component({
    selector: 'mobile-seach-company',
    templateUrl: './mobile-search-company.component.html',
    styleUrls: ['./mobile-search-company.component.scss']
})
export class MobileSearchCompanyComponent implements OnInit, OnDestroy{
    comapnyList = [
        {
            CompanyName: "Sample Name"
        }, 
        {
            CompanyName: "Comapny Name"
        },  
    ]

    public searchElement: ElementRef;
    public addFocus:false;
    public focusInSearchBox(e?: KeyboardEvent): void {
        if (this.searchElement) {
            this.searchElement.nativeElement.focus();
        }
    }
    public ngOnInit(){
        document.querySelector('body').classList.add('remove-header-lower-layer');
    }
    public ngOnDestroy(){
        document.querySelector('body').classList.remove('remove-header-lower-layer');
    }
}
