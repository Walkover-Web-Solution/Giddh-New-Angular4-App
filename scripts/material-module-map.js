/**
 * Shared Angular Material module mapping
 * Maps Material module names to their specific import paths
 * Used by build optimization scripts to convert barrel imports to specific imports
 */
const MATERIAL_MODULE_MAP = {
    'MatButtonModule': '@angular/material/button',
    'MatCardModule': '@angular/material/card',
    'MatFormFieldModule': '@angular/material/form-field',
    'MatInputModule': '@angular/material/input',
    'MatSelectModule': '@angular/material/select',
    'MatDialogModule': '@angular/material/dialog',
    'MatIconModule': '@angular/material/icon',
    'MatToolbarModule': '@angular/material/toolbar',
    'MatSidenavModule': '@angular/material/sidenav',
    'MatListModule': '@angular/material/list',
    'MatTableModule': '@angular/material/table',
    'MatPaginatorModule': '@angular/material/paginator',
    'MatSortModule': '@angular/material/sort',
    'MatCheckboxModule': '@angular/material/checkbox',
    'MatRadioModule': '@angular/material/radio',
    'MatSlideToggleModule': '@angular/material/slide-toggle',
    'MatProgressSpinnerModule': '@angular/material/progress-spinner',
    'MatProgressBarModule': '@angular/material/progress-bar',
    'MatSnackBarModule': '@angular/material/snack-bar',
    'MatTooltipModule': '@angular/material/tooltip',
    'MatMenuModule': '@angular/material/menu',
    'MatTabsModule': '@angular/material/tabs',
    'MatStepperModule': '@angular/material/stepper',
    'MatExpansionModule': '@angular/material/expansion',
    'MatChipsModule': '@angular/material/chips',
    'MatAutocompleteModule': '@angular/material/autocomplete',
    'MatDatepickerModule': '@angular/material/datepicker',
    'MatSliderModule': '@angular/material/slider',
    'MatGridListModule': '@angular/material/grid-list',
    'MatBadgeModule': '@angular/material/badge',
    'MatBottomSheetModule': '@angular/material/bottom-sheet',
    'MatButtonToggleModule': '@angular/material/button-toggle',
    'MatDividerModule': '@angular/material/divider',
    'MatRippleModule': '@angular/material/core',
    'MatNativeDateModule': '@angular/material/core',
    'MatCommonModule': '@angular/material/core'
};

module.exports = { MATERIAL_MODULE_MAP };
