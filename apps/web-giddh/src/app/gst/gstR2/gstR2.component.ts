import { Component, OnInit, OnDestroy } from '@angular/core';

declare var jquery: any;
declare var $: any;

@Component({
    selector: 'file-gstr2',
    templateUrl: './gstR2.component.html',
    styleUrls: ['gstR2.component.scss'],
})
export class FileGstR2Component implements OnInit, OnDestroy {
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* this will check mobile screen size */
    public isMobileScreen: boolean = false;

    constructor() {
        //
    }
    /**
     * Aside pane toggle fixed class
     *
     *
     * @memberof FileGstR2Component
     */
    public toggleBodyClass(): void {
        if (this.asideGstSidebarMenuState === 'in') {
            document.querySelector('body').classList.add('gst-sidebar-open');
        } else {
            document.querySelector('body').classList.remove('gst-sidebar-open');
        }
    }
    /**
     * This will toggle the settings popup
     *
     * @param {*} [event]
     * @memberof FileGstR2Component
     */
    public toggleGstPane(event?): void {
        this.toggleBodyClass();

        if (this.isMobileScreen && event && this.asideGstSidebarMenuState === 'in') {
            this.asideGstSidebarMenuState = "out";
        }
    }
    public ngOnInit() {
        this.toggleGstPane();
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

        $('.sub-filter-nav-bandnew ul li a').on('click', function (event) {
            event.preventDefault();

            $('.sub-filter-nav-bandnew ul li').removeClass('active');
            $(this).parent().addClass('active');
            $('.subtabs-box1').hide();
            $($(this).attr('href')).show();
        });

        $('.filter').each(function () {
            let $dropdown = $(this);

            $(".dropdown-toggle", $dropdown).click(function (e) {
                e.preventDefault();
                $(".dropdown-menu", $dropdown).toggle();
                return false;

            });

        });

        $('.actions-dropdown').each(function () {
            let $dropdown = $(this);

            $(".dropdown-toggle", $dropdown).click(function (e) {
                e.preventDefault();
                $(".dropdown-menu", $dropdown).toggle();
                return false;

            });

        });

        $('html').click(function () {
            $('.dropdown-menu').hide();
        });

        $('.showdiv').on('click', function (event) {
            $('#tab2').show();
            $('.tabs-new li').removeClass('active');
            $('.reco_active').addClass('active');
            $('#tab1, #tab3, #tabs4').hide();

        });
    }
    /**
     * Unsubscribes from subscription
     *
     * @memberof FileGstR2Component
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('gst-sidebar-open');
    }
}
