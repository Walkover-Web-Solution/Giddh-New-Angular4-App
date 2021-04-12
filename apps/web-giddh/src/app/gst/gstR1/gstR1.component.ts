import { Component, OnInit } from '@angular/core';

declare var jquery: any;
declare var $: any;

@Component({
    selector: 'file-gstR1',
    templateUrl: './gstR1.component.html',
    styleUrls: ['gstR1.component.scss'],
})
export class FileGstR1Component implements OnInit {
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideInventorySidebarMenuState: string = 'in';
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* this will check mobile screen size */
    public isMobileScreen: boolean = false;

    constructor() {
        //
    }
    /**
      * Aside pane toggle fixed clas
      *
      *
      * @memberof FileGstR1Component
      */

    public toggleBodyClass(): void {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }
    /**
      * This will toggle the settings popup
      *
      * @param {*} [event]
      * @memberof FileGstR1Component
      */
    public toggleSettingPane(event?): void {
        this.toggleBodyClass();

        if (this.isMobileScreen && event && this.asideInventorySidebarMenuState === 'in') {
            this.asideInventorySidebarMenuState = "out";
        }
    }

    public ngOnInit() {
        $('.tabs-new a').on('click', function (event) {
            event.preventDefault();

            $('.tabs-new li').removeClass('active');
            $(this).parent().addClass('active');
            $('.tab1div').hide();
            $($(this).attr('href')).show();
        });

        $('#tab_2').on('click', function (event) {

            $('#subtabs').show();

        });
        $('#tab_1').on('click', function (event) {

            $('#hidebox').show();

        });
        $('.back-button').on('click', function (event) {

            $('#hidebox').show();
            $('#tab-1').show();
            $('#fillterid').hide();

        });
        $('#tab_1, #tab_3').on('click', function (event) {

            $('#subtabs').hide();

        });
        $('.transactions-summary-table tbody tr').on('click', function (event) {

            $('#fillterid').show();
            $('#hidebox').hide();

        });

        $('.sub-filter-nav-band ul li a').on('click', function (event) {
            event.preventDefault();

            $('.sub-filter-nav-band ul li').removeClass('active');
            $(this).parent().addClass('active');
            $('.subtabs-box').hide();
            $($(this).attr('href')).show();
        });

        $('.filter').each(function () {
            let $dropdown = $(this);

            $('.dropdown-toggle', $dropdown).click(function (e) {
                e.preventDefault();
                $('.dropdown-menu', $dropdown).toggle();
                return false;

            });

        });

        $('html').click(function () {
            $('.dropdown-menu').hide();
        });

    }

}
