/// <reference types="jasmine" />
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// Load the implementations that should be tested
import { AppComponent } from './app.component';
import { rootReducer } from './reducers';
import { HomeActions } from './home';

xdescribe(`App`, () => {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    // async beforeEach
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            imports: [],
            schemas: [NO_ERRORS_SCHEMA],
            providers: []
        })
            .compileComponents(); // compile template and css
    }));

    // synchronous beforeEach
    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges(); // trigger initial data binding
    });

    it(`should be readly initialized`, () => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    });

    // it(`should be @AngularClass`, () => {
    //   expect(comp.url).toEqual('https://github.com/colinskow/angular-electron-dream-starter');
    //   expect(comp.angularclassLogo).toEqual('assets/img/angular-electron.svg');
    //   expect(comp.name).toEqual('Angular Electron Dream Starter');
    // });

});
