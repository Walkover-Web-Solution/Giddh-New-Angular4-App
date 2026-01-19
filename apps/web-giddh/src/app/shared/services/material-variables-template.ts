/**
 * Complete Angular Material Component CSS Variables Template
 * Converted from SCSS nested syntax to flat CSS format for dynamic injection
 */
export const MATERIAL_VARIABLES_CSS_TEMPLATE = `
/* ========================================
   ANGULAR MATERIAL 16 COMPONENT CSS VARIABLES
   ========================================
   Author: Divyanshu Shrivastava
   Date: 2025-09-15
   Version: 1.0.0
   License: MIT
   ======================================== */

    /* Base Variables */
    :root {

         /* Neutral colors */
         --mat-background-color: #424242;
         --mat-background-color-rgb: 66, 66, 66;
         --mat-surface-color: #303030;
         --mat-text-color: #ffffff;
         --mat-secondary-text-color: rgba(255, 255, 255, 0.7);
         --mat-disabled-color: rgba(255, 255, 255, 0.5);
         --mat-disabled-background-color: #6e6e6e;
         --mat-transparent-color: transparent;
         --mat-divider-color: rgba(255, 255, 255, 0.12);

         /* Elevation */
         --mat-elevation-1: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
             0px 1px 3px 0px rgba(0, 0, 0, 0.12);
         --mat-elevation-2: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
             0px 1px 5px 0px rgba(0, 0, 0, 0.12);
         --mat-elevation-3: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14),
             0px 9px 46px 8px rgba(0, 0, 0, 0.12);

         /* State opacities */
         --mat-hover-opacity: 0.08;
         --mat-focus-opacity: 0.24;
         --mat-pressed-opacity: 0.24;
         --mat-dragged-opacity: 0.16;

         /* Border radius */
         /*  THIS CODE IS COMMENT FROM HERE AND MOVE TO @include border-radius-utilities();
         --mat-border-radius-4: 4px;
         --mat-border-radius-8: 8px;
         --mat-border-radius-12: 12px;
         --mat-border-radius-16: 16px;
         */
    }


    html {
        --mat-autocomplete-background-color: var(--mat-background-color);
    }

    html {
        /* default/primary color */
        --mat-badge-background-color: var(--theme-primary-color);
        --mat-badge-text-color: var(--mat-primary-contrast-color);
        --mat-badge-disabled-state-background-color: var(--mat-disabled-background-color);
        --mat-badge-disabled-state-text-color: var(--mat-disabled-color);

        /* typography */
        --mat-badge-text-font: var(--font-family);
        --mat-badge-text-size: var(--font-size-12);
        --mat-badge-text-weight: var(--font-weight-semibold);
        --mat-badge-small-size-text-size: var(--font-size-9);
        --mat-badge-large-size-text-size: var(--font-size-24);
    }

    .mat-badge-accent {
        /* accent color */
        --mat-badge-background-color: var(--theme-accent-color);
        --mat-badge-text-color: var(--mat-accent-contrast-color);
    }

    .mat-badge-warn {
        /* warn color */
        --mat-badge-background-color: var(--theme-warn-color);
        --mat-badge-text-color: var(--mat-warn-contrast-color);
    }

    html {
        /* border-radius */
        --mat-bottom-sheet-container-shape: var(--mat-border-radius-4);
        /* color */
        --mat-bottom-sheet-container-text-color: var(--mat-text-color);
        --mat-bottom-sheet-container-background-color: var(--mat-background-color);
        /* typography */
        --mat-bottom-sheet-container-text-font: var(--font-family);
        --mat-bottom-sheet-container-text-line-height: var(--line-height-20);
        --mat-bottom-sheet-container-text-size: var(--font-size-14);
        --mat-bottom-sheet-container-text-tracking: 0.0178571429em;
        --mat-bottom-sheet-container-text-weight: var(--font-weight-regular);
    }

    html {
        /* typography */
        --mdc-text-button-label-text-font: var(--font-family);
        --mdc-text-button-label-text-size: var(--font-size-14);
        --mdc-text-button-label-text-tracking: 0.0892857143em;
        --mdc-text-button-label-text-weight: var(--font-weight-medium);
        --mdc-text-button-label-text-transform: none;
    }

    .mat-mdc-button {
        /* default color */
        --mdc-text-button-label-text-color: var(--mat-text-color);
        --mdc-text-button-disabled-label-text-color: var(--mat-disabled-color);
        --mat-text-button-state-layer-color: var(--mat-text-color);
        --mat-text-button-ripple-color: rgba(var(--mat-text-color), var(--mat-hover-opacity));

        /* hover/focus/active opacity */
        --mat-text-button-hover-state-layer-opacity: var(--mat-hover-opacity);
        --mat-text-button-focus-state-layer-opacity: var(--mat-focus-opacity);
        --mat-text-button-pressed-state-layer-opacity: var(--mat-pressed-opacity);
        /* text container */
        --mdc-text-button-container-height: 36px;
    }

    .mat-mdc-button.mat-primary {
        /* primary color */
        --mdc-text-button-label-text-color: var(--theme-primary-color);
        --mat-text-button-state-layer-color: var(--theme-primary-color);
        --mat-text-button-ripple-color: rgba(var(--mat-text-primary-rgb), var(--mat-hover-opacity));
    }

    .mat-mdc-button.mat-accent {
        /* accent color */
        --mdc-text-button-label-text-color: var(--theme-accent-color);
        --mat-text-button-state-layer-color: var(--theme-accent-color);
        --mat-text-button-ripple-color: rgba(var(--mat-accent-color-rgb), var(--mat-hover-opacity));
    }

    .mat-mdc-button.mat-warn {
        /* warn color */
        --mdc-text-button-label-text-color: var(--theme-warn-color);
        --mat-text-button-state-layer-color: var(--theme-warn-color);
        --mat-text-button-ripple-color: rgba(var(--mat-warn-color-rgb), var(--mat-hover-opacity));
    }

    html {
        /* typography */
        --mdc-filled-button-label-text-font: var(--font-family);
        --mdc-filled-button-label-text-size: var(--font-size-14);
        --mdc-filled-button-label-text-tracking: 0.0892857143em;
        --mdc-filled-button-label-text-weight: var(--font-weight-medium);
        --mdc-filled-button-label-text-transform: none;
    }

    .mat-mdc-unelevated-button {
        /* default color */
        --mdc-filled-button-container-color: var(--mat-background-color);
        --mdc-filled-button-label-text-color: var(--mat-text-color);
        --mdc-filled-button-disabled-container-color: rgba(var(--mat-text-color), 0.12);
        --mdc-filled-button-disabled-label-text-color: var(--mat-disabled-color);
        --mat-filled-button-state-layer-color: var(--mat-text-color);
        --mat-filled-button-ripple-color: rgba(var(--mat-text-color), var(--mat-hover-opacity));

        /* hover/focus/active opacity */
        --mat-filled-button-hover-state-layer-opacity: var(--mat-hover-opacity);
        --mat-filled-button-focus-state-layer-opacity: var(--mat-focus-opacity);
        --mat-filled-button-pressed-state-layer-opacity: var(--mat-pressed-opacity);
        /* text-container */
        --mdc-filled-button-container-height: 36px;
    }

    .mat-mdc-unelevated-button.mat-primary {
        /* primary color */
        --mdc-filled-button-container-color: var(--theme-primary-color);
        --mdc-filled-button-label-text-color: var(--mat-primary-contrast-color);
        --mat-filled-button-state-layer-color: var(--mat-primary-contrast-color);
        --mat-filled-button-ripple-color: rgba(var(--mat-primary-contrast-color), var(--mat-hover-opacity));
    }

    .mat-mdc-unelevated-button.mat-accent {
        /* accent color */
        --mdc-filled-button-container-color: var(--theme-accent-color);
        --mdc-filled-button-label-text-color: var(--mat-accent-contrast-color);
        --mat-filled-button-state-layer-color: var(--mat-accent-contrast-color);
        --mat-filled-button-ripple-color: rgba(var(--mat-accent-contrast-color), var(--mat-hover-opacity));
    }

    .mat-mdc-unelevated-button.mat-warn {
        /* warn color */
        --mdc-filled-button-container-color: var(--theme-warn-color);
        --mdc-filled-button-label-text-color: var(--mat-warn-contrast-color);
        --mat-filled-button-state-layer-color: var(--mat-warn-contrast-color);
        --mat-filled-button-ripple-color: rgba(var(--mat-warn-contrast-color), var(--mat-hover-opacity));
    }

    html {
        /* typography */
        --mdc-protected-button-label-text-font: var(--font-family);
        --mdc-protected-button-label-text-size: var(--font-size-14);
        --mdc-protected-button-label-text-tracking: 0.0892857143em;
        --mdc-protected-button-label-text-weight: var(--font-weight-medium);
        --mdc-protected-button-label-text-transform: none;
    }

    .mat-mdc-raised-button {
        /* default color */
        --mdc-protected-button-container-color: var(--mat-background-color);
        --mdc-protected-button-label-text-color: var(--mat-text-color);
        --mdc-protected-button-disabled-container-color: rgba(var(--mat-text-color), 0.12);
        --mdc-protected-button-disabled-label-text-color: var(--mat-disabled-color);
        --mat-protected-button-state-layer-color: var(--mat-text-color);
        --mat-protected-button-ripple-color: rgba(var(--mat-text-color), var(--mat-hover-opacity));

        /* hover/focus/active opacity */
        --mat-protected-button-hover-state-layer-opacity: var(--mat-hover-opacity);
        --mat-protected-button-focus-state-layer-opacity: var(--mat-focus-opacity);
        --mat-protected-button-pressed-state-layer-opacity: var(--mat-pressed-opacity);

        /* text-container */
        --mdc-protected-button-container-height: 36px;
    }

    .mat-mdc-raised-button.mat-primary {
        /* primary color */
        --mdc-protected-button-container-color: var(--theme-primary-color);
        --mdc-protected-button-label-text-color: var(--mat-primary-contrast-color);
        --mat-protected-button-state-layer-color: var(--mat-primary-contrast-color);
        --mat-protected-button-ripple-color: rgba(var(--mat-primary-contrast-color), var(--mat-hover-opacity));
    }

    .mat-mdc-raised-button.mat-accent {
        /* accent color */
        --mdc-protected-button-container-color: var(--theme-accent-color);
        --mdc-protected-button-label-text-color: var(--mat-accent-contrast-color);
        --mat-protected-button-state-layer-color: var(--mat-accent-contrast-color);
        --mat-protected-button-ripple-color: rgba(var(--mat-accent-contrast-color), var(--mat-hover-opacity));
    }

    .mat-mdc-raised-button.mat-warn {
        /* warn color */
        --mdc-protected-button-container-color: var(--theme-warn-color);
        --mdc-protected-button-label-text-color: var(--mat-warn-contrast-color);
        --mat-protected-button-state-layer-color: var(--mat-warn-contrast-color);
        --mat-protected-button-ripple-color: rgba(var(--mat-warn-contrast-color), var(--mat-hover-opacity));
    }

    html {
        /* typography */
        --mdc-outlined-button-label-text-font: var(--font-family);
        --mdc-outlined-button-label-text-size: var(--font-size-14);
        --mdc-outlined-button-label-text-tracking: 0.0892857143em;
        --mdc-outlined-button-label-text-weight: var(--font-weight-medium);
        --mdc-outlined-button-label-text-transform: none;
    }

    .mat-mdc-outlined-button {
        /* default color */
        --mdc-outlined-button-disabled-outline-color: rgba(var(--mat-text-color), 0.12);
        --mdc-outlined-button-disabled-label-text-color: var(--mat-disabled-color);
        --mdc-outlined-button-label-text-color: var(--mat-text-color);
        --mdc-outlined-button-outline-color: rgba(var(--mat-text-color), 0.12);
        --mat-outlined-button-state-layer-color: var(--mat-text-color);
        --mat-outlined-button-ripple-color: rgba(var(--mat-text-color), var(--mat-hover-opacity));

        /* hover/focus/active opacity */
        --mat-outlined-button-hover-state-layer-opacity: var(--mat-hover-opacity);
        --mat-outlined-button-focus-state-layer-opacity: var(--mat-focus-opacity);
        --mat-outlined-button-pressed-state-layer-opacity: var(--mat-pressed-opacity);
        /* text container height */
        --mdc-outlined-button-container-height: 36px;
    }

    .mat-mdc-outlined-button.mat-primary {
        /* primary color */
        --mdc-outlined-button-label-text-color: var(--theme-primary-color);
        --mdc-outlined-button-outline-color: rgba(var(--mat-text-color), 0.12);
        --mat-outlined-button-state-layer-color: var(--theme-primary-color);
        --mat-outlined-button-ripple-color: rgba(var(--mat-text-primary-rgb), var(--mat-hover-opacity));
    }

    .mat-mdc-outlined-button.mat-accent {
        /* accent color */
        --mdc-outlined-button-label-text-color: var(--theme-accent-color);
        --mdc-outlined-button-outline-color: rgba(var(--mat-text-color), 0.12);
        --mat-outlined-button-state-layer-color: var(--theme-accent-color);
        --mat-outlined-button-ripple-color: rgba(var(--mat-accent-color-rgb), var(--mat-hover-opacity));
    }

    .mat-mdc-outlined-button.mat-warn {
        /* warn color */
        --mdc-outlined-button-label-text-color: var(--theme-warn-color);
        --mdc-outlined-button-outline-color: rgba(var(--mat-text-color), 0.12);
        --mat-outlined-button-state-layer-color: var(--theme-warn-color);
        --mat-outlined-button-ripple-color: rgba(var(--mat-warn-color-rgb), var(--mat-hover-opacity));
    }

    .mat-mdc-icon-button {
        /* default color */
        --mdc-icon-button-icon-color: var(--mat-text-color);
        --mdc-icon-button-disabled-icon-color: var(--mat-disabled-color);
        --mat-icon-button-state-layer-color: var(--mat-text-color);
        --mat-icon-button-ripple-color: rgba(var(--mat-text-color), var(--mat-hover-opacity));

        /* hover/focus/active opacity */
        --mat-icon-button-hover-state-layer-opacity: var(--mat-hover-opacity);
        --mat-icon-button-focus-state-layer-opacity: var(--mat-focus-opacity);
        --mat-icon-button-pressed-state-layer-opacity: var(--mat-pressed-opacity);
    }

    .mat-mdc-icon-button.mat-primary {
        /* primary color */
        --mdc-icon-button-icon-color: var(--theme-primary-color);
        --mat-icon-button-state-layer-color: var(--theme-primary-color);
        --mat-icon-button-ripple-color: rgba(var(--mat-text-primary-rgb), var(--mat-hover-opacity));
    }

    .mat-mdc-icon-button.mat-accent {
        /* accent color */
        --mdc-icon-button-icon-color: var(--theme-accent-color);
        --mat-icon-button-state-layer-color: var(--theme-accent-color);
        --mat-icon-button-ripple-color: rgba(var(--mat-accent-color-rgb), var(--mat-hover-opacity));
    }

    .mat-mdc-icon-button.mat-warn {
        /* warn color */
        --mdc-icon-button-icon-color: var(--theme-warn-color);
        --mat-icon-button-state-layer-color: var(--theme-warn-color);
        --mat-icon-button-ripple-color: rgba(var(--mat-warn-color-rgb), var(--mat-hover-opacity));
    }

    .mat-mdc-icon-button.mat-mdc-button-base {
        /* button size */
        --mdc-icon-button-state-layer-size: 48px;
    }

    html {
        /* border radius */
        --mdc-fab-container-shape: 50%;

        /* icon size */
        --mdc-fab-icon-size: 24px;
    }

    html {
        /* default color */
        --mdc-fab-container-color: var(--mat-background-color);
        --mat-fab-foreground-color: var(--mat-text-color);
        --mat-fab-state-layer-color: var(--mat-text-color);
        --mat-fab-ripple-color: rgba(var(--mat-text-color-rgb), var(--mat-hover-opacity));
        --mat-fab-disabled-state-container-color: rgba(var(--mat-text-color-rgb), 0.12);
        --mat-fab-disabled-state-foreground-color: var(--mat-disabled-color);
        /* hover/focus/active opacity */
        --mat-fab-hover-state-layer-opacity: var(--mat-hover-opacity);
        --mat-fab-focus-state-layer-opacity: var(--mat-focus-opacity);
        --mat-fab-pressed-state-layer-opacity: var(--mat-pressed-opacity);
    }

    html .mat-mdc-fab.mat-primary,
    html .mat-mdc-mini-fab.mat-primary {
        /* primary color */
        --mdc-fab-container-color: var(--theme-primary-color);
        --mat-fab-foreground-color: var(--mat-primary-contrast-color);
        --mat-fab-state-layer-color: var(--mat-primary-contrast-color);
        --mat-fab-ripple-color: rgba(var(--mat-primary-contrast-color-rgb), var(--mat-hover-opacity));
    }

    html .mat-mdc-fab.mat-accent,
    html .mat-mdc-mini-fab.mat-accent {
        /* accent color */
        --mdc-fab-container-color: var(--theme-accent-color);
        --mat-fab-foreground-color: var(--mat-accent-contrast-color);
        --mat-fab-state-layer-color: var(--mat-accent-contrast-color);
        --mat-fab-ripple-color: rgba(var(--mat-accent-contrast-color-rgb), var(--mat-hover-opacity));
    }

    html .mat-mdc-fab.mat-warn,
    html .mat-mdc-mini-fab.mat-warn {
        /* warn color */
        --mdc-fab-container-color: var(--theme-warn-color);
        --mat-fab-foreground-color: var(--mat-warn-contrast-color);
        --mat-fab-state-layer-color: var(--mat-warn-contrast-color);
        --mat-fab-ripple-color: rgba(var(--mat-warn-contrast-color-rgb), var(--mat-hover-opacity));
    }

    html {
        --mdc-extended-fab-label-text-font: var(--font-family);
        --mdc-extended-fab-label-text-size: var(--font-size-14);
        --mdc-extended-fab-label-text-tracking: 0.0892857143em;
        --mdc-extended-fab-label-text-weight: var(--font-weight-medium);
    }

    html {
        /* size - Updated for Angular 21 Material Design 3 */
        --mat-button-toggle-height: 48px;
        --mat-standard-button-toggle-height: 48px;
        /* border-radius - Updated for Angular 21 Material Design 3 */
        --mat-button-toggle-shape: 4px;
        --mat-standard-button-toggle-shape: 4px;

        /* opacity - Updated for Angular 21 Material Design 3 */
        --mat-button-toggle-focus-state-layer-opacity: 0.12;
        --mat-standard-button-toggle-hover-state-layer-opacity: 0.04;
        --mat-standard-button-toggle-focus-state-layer-opacity: 0.12;
        /* color - Updated for Angular 21 Material Design 3 */
        --mat-button-toggle-text-color: var(--mat-text-color);
        --mat-button-toggle-state-layer-color: var(--mat-text-color);
        --mat-button-toggle-selected-state-text-color: var(--mat-text-color);
        --mat-button-toggle-selected-state-background-color: var(--mat-surface-color);
        --mat-button-toggle-disabled-state-text-color: var(--mat-disabled-color);
        --mat-button-toggle-disabled-state-background-color: var(--mat-background-color);
        --mat-button-toggle-disabled-selected-state-background-color: var(--mat-background-color);
        --mat-standard-button-toggle-text-color: var(--mat-text-color);
        --mat-standard-button-toggle-background-color: var(--mat-background-color);
        --mat-standard-button-toggle-state-layer-color: var(--mat-text-color);
        --mat-standard-button-toggle-selected-state-background-color: var(--mat-surface-color);
        --mat-standard-button-toggle-selected-state-text-color: var(--mat-text-color);
        --mat-standard-button-toggle-disabled-state-text-color: var(--mat-disabled-color);
        --mat-standard-button-toggle-disabled-state-background-color: var(--mat-background-color);
        --mat-standard-button-toggle-disabled-selected-state-text-color: var(--mat-text-color);
        --mat-standard-button-toggle-disabled-selected-state-background-color: var(--mat-background-color);
        --mat-standard-button-toggle-divider-color: rgba(var(--mat-text-color-rgb), 0.12);
        /* typography - Updated for Angular 21 Material Design 3 */
        --mat-button-toggle-text-font: var(--font-family);
        --mat-standard-button-toggle-text-font: var(--font-family);
    }

    html {
        /* border-radius */
        --mdc-elevated-card-container-shape: var(--border-radius-4);
        --mdc-outlined-card-container-shape: var(--border-radius-4);

        /* width */
        --mdc-outlined-card-outline-width: 1px;

        /* colors */
        --mdc-elevated-card-container-color: var(--mat-card-background-color);
        --mdc-elevated-card-container-elevation: var(--mat-elevation-2);
        --mdc-elevated-card-container-shadow-color: var(--mat-shadow-color);
        --mdc-outlined-card-container-color: var(--mat-card-background-color);
        --mdc-outlined-card-outline-color: rgba(var(--mat-text-color), 0.12);
        --mdc-outlined-card-container-elevation: var(--mat-elevation-0);
        --mat-card-subtitle-text-color: rgba(var(--mat-text-color), 0.7);

        /* typography */
        --mat-card-title-text-font: var(--font-family);
        --mat-card-title-text-line-height: var(--line-height-32);
        --mat-card-title-text-size: var(--font-size-20);
        --mat-card-title-text-tracking: 0.0125em;
        --mat-card-title-text-weight: var(--font-weight-medium);
        --mat-card-subtitle-text-font: var(--font-family);
        --mat-card-subtitle-text-line-height: var(--line-height-22);
        --mat-card-subtitle-text-size: var(--font-size-14);
        --mat-card-subtitle-text-tracking: 0.0071428571em;
        --mat-card-subtitle-text-weight: var(--font-weight-medium);
    }

    html {
        /* size */
        --mdc-checkbox-state-layer-size: 40px;

        /* hover/focus/active opacity */
        --mdc-checkbox-selected-focus-state-layer-opacity: var(--mat-focus-opacity);
        --mdc-checkbox-selected-hover-state-layer-opacity: var(--mat-hover-opacity);
        --mdc-checkbox-selected-pressed-state-layer-opacity: var(--mat-pressed-opacity);
        --mdc-checkbox-unselected-focus-state-layer-opacity: var(--mat-focus-opacity);
        --mdc-checkbox-unselected-hover-state-layer-opacity: var(--mat-hover-opacity);
        --mdc-checkbox-unselected-pressed-state-layer-opacity: var(--mat-pressed-opacity);

        /* default/accent color */
        --mdc-checkbox-disabled-selected-checkmark-color: var(--mat-accent-contrast-color);
        --mdc-checkbox-disabled-selected-icon-color: var(--mat-disabled-color);
        --mdc-checkbox-disabled-unselected-icon-color: var(--mat-disabled-color);
        --mdc-checkbox-selected-checkmark-color: var(--mat-accent-contrast-color);
        --mdc-checkbox-selected-focus-icon-color: var(--theme-accent-color);
        --mdc-checkbox-selected-hover-icon-color: var(--theme-accent-color);
        --mdc-checkbox-selected-icon-color: var(--theme-accent-color);
        --mdc-checkbox-selected-pressed-icon-color: var(--theme-accent-color);
        --mdc-checkbox-unselected-focus-icon-color: var(--mat-text-color);
        --mdc-checkbox-unselected-hover-icon-color: var(--mat-text-color);
        --mdc-checkbox-unselected-icon-color: rgba(var(--mat-text-color-rgb), 0.54);
        --mdc-checkbox-unselected-pressed-icon-color: rgba(var(--mat-text-color-rgb), 0.54);
        --mdc-checkbox-selected-focus-state-layer-color: var(--theme-accent-color);
        --mdc-checkbox-selected-hover-state-layer-color: var(--theme-accent-color);
        --mdc-checkbox-selected-pressed-state-layer-color: var(--theme-accent-color);
        --mdc-checkbox-unselected-focus-state-layer-color: var(--mat-text-color);
        --mdc-checkbox-unselected-hover-state-layer-color: var(--mat-text-color);
        --mdc-checkbox-unselected-pressed-state-layer-color: var(--mat-text-color);
    }

    .mat-mdc-checkbox.mat-primary {
        /* primary color */
        --mdc-checkbox-disabled-selected-icon-color: var(--mat-disabled-color);
        --mdc-checkbox-disabled-unselected-icon-color: var(--mat-disabled-color);
        --mdc-checkbox-selected-checkmark-color: var(--mat-primary-contrast-color);
        --mdc-checkbox-selected-focus-icon-color: var(--theme-primary-color);
        --mdc-checkbox-selected-hover-icon-color: var(--theme-primary-color);
        --mdc-checkbox-selected-icon-color: var(--theme-primary-color);
        --mdc-checkbox-selected-pressed-icon-color: var(--theme-primary-color);
        --mdc-checkbox-unselected-focus-icon-color: var(--mat-text-color);
        --mdc-checkbox-unselected-hover-icon-color: var(--mat-text-color);
        --mdc-checkbox-unselected-icon-color: rgba(var(--mat-text-color), 0.54);
        --mdc-checkbox-unselected-pressed-icon-color: rgba(var(--mat-text-color), 0.54);
        --mdc-checkbox-selected-focus-state-layer-color: var(--theme-primary-color);
        --mdc-checkbox-selected-hover-state-layer-color: var(--theme-primary-color);
        --mdc-checkbox-selected-pressed-state-layer-color: var(--theme-primary-color);
        --mdc-checkbox-unselected-focus-state-layer-color: var(--mat-text-color);
        --mdc-checkbox-unselected-hover-state-layer-color: var(--mat-text-color);
        --mdc-checkbox-unselected-pressed-state-layer-color: var(--mat-text-color);
    }

    .mat-mdc-checkbox.mat-warn {
        /* warn color */
        --mdc-checkbox-disabled-selected-icon-color: var(--mat-disabled-color);
        --mdc-checkbox-disabled-unselected-icon-color: var(--mat-disabled-color);
        --mdc-checkbox-selected-checkmark-color: var(--mat-warn-contrast-color);
        --mdc-checkbox-selected-focus-icon-color: var(--theme-warn-color);
        --mdc-checkbox-selected-hover-icon-color: var(--theme-warn-color);
        --mdc-checkbox-selected-icon-color: var(--theme-warn-color);
        --mdc-checkbox-selected-pressed-icon-color: var(--theme-warn-color);
        --mdc-checkbox-unselected-focus-icon-color: var(--mat-text-color);
        --mdc-checkbox-unselected-hover-icon-color: var(--mat-text-color);
        --mdc-checkbox-unselected-icon-color: rgba(var(--mat-text-color-rgb), 0.54);
        --mdc-checkbox-unselected-pressed-icon-color: rgba(var(--mat-text-color-rgb), 0.54);
        --mdc-checkbox-selected-focus-state-layer-color: var(--theme-warn-color);
        --mdc-checkbox-selected-hover-state-layer-color: var(--theme-warn-color);
        --mdc-checkbox-selected-pressed-state-layer-color: var(--theme-warn-color);
        --mdc-checkbox-unselected-focus-state-layer-color: var(--mat-text-color);
        --mdc-checkbox-unselected-hover-state-layer-color: var(--mat-text-color);
        --mdc-checkbox-unselected-pressed-state-layer-color: var(--mat-text-color);
    }

    .mat-mdc-standard-chip {
        /* shape */
        --mdc-chip-container-shape-family: rounded;
        --mdc-chip-container-shape-radius: var(--border-radius-16);
        --mdc-chip-with-avatar-avatar-shape-family: rounded;
        --mdc-chip-with-avatar-avatar-shape-radius: 14px 14px 14px 14px;
        --mdc-chip-with-avatar-avatar-size: 28px;
        --mdc-chip-with-icon-icon-size: 18px;

        /* color */
        --mdc-chip-disabled-label-text-color: var(--mat-disabled-color);
        --mdc-chip-elevated-container-color: var(--mat-surface-color);
        --mdc-chip-elevated-disabled-container-color: var(--mat-surface-color);
        --mdc-chip-focus-state-layer-color: var(--mat-text-color);
        --mdc-chip-focus-state-layer-opacity: var(--mat-focus-opacity);
        --mdc-chip-label-text-color: var(--mat-text-color);
        --mdc-chip-with-icon-icon-color: var(--mat-text-color);
        --mdc-chip-with-icon-disabled-icon-color: var(--mat-disabled-color);
        --mdc-chip-with-icon-selected-icon-color: var(--mat-text-color);
        --mdc-chip-with-trailing-icon-disabled-trailing-icon-color: var(--mat-disabled-color);
        --mdc-chip-with-trailing-icon-trailing-icon-color: var(--mat-text-color);
    }

    .mat-mdc-standard-chip.mat-mdc-chip-selected.mat-primary,
    .mat-mdc-standard-chip.mat-mdc-chip-highlighted.mat-primary {
        /* primary color */
        --mdc-chip-disabled-label-text-color: var(--mat-primary-contrast-color);
        --mdc-chip-elevated-container-color: var(--theme-primary-color);
        --mdc-chip-elevated-disabled-container-color: var(--theme-primary-color);
        --mdc-chip-focus-state-layer-color: var(--mat-primary-contrast-color);
        --mdc-chip-focus-state-layer-opacity: var(--mat-focus-opacity);
        --mdc-chip-label-text-color: var(--mat-primary-contrast-color);
        --mdc-chip-with-icon-icon-color: var(--mat-primary-contrast-color);
        --mdc-chip-with-icon-disabled-icon-color: var(--mat-primary-contrast-color);
        --mdc-chip-with-icon-selected-icon-color: var(--mat-primary-contrast-color);
        --mdc-chip-with-trailing-icon-disabled-trailing-icon-color: var(--mat-primary-contrast-color);
        --mdc-chip-with-trailing-icon-trailing-icon-color: var(--mat-primary-contrast-color);
    }

    .mat-mdc-standard-chip.mat-mdc-chip-selected.mat-accent,
    .mat-mdc-standard-chip.mat-mdc-chip-highlighted.mat-accent {
        /* default color */
        --mdc-chip-disabled-label-text-color: var(--mat-disabled-color);
        --mdc-chip-elevated-container-color: var(--mat-chip-background-color);
        --mdc-chip-elevated-container-elevation: var(--mat-elevation-1);
        --mdc-chip-elevated-container-shadow-color: var(--mat-shadow-color);
        --mdc-chip-elevated-disabled-container-color: rgba(var(--mat-text-color), 0.12);
        --mdc-chip-elevated-disabled-container-elevation: var(--mat-elevation-0);
        --mdc-chip-elevated-disabled-container-opacity: var(--mat-disabled-opacity);
        --mdc-chip-elevated-focus-container-elevation: var(--mat-elevation-1);
        --mdc-chip-elevated-hover-container-elevation: var(--mat-elevation-1);
        --mdc-chip-elevated-pressed-container-elevation: var(--mat-elevation-1);
        --mdc-chip-flat-disabled-outline-color: rgba(var(--mat-text-color), 0.12);
        --mdc-chip-flat-disabled-outline-opacity: var(--mat-disabled-opacity);
        --mdc-chip-flat-outline-color: rgba(var(--mat-text-color), 0.12);
        --mdc-chip-flat-outline-width: 1px;
        --mdc-chip-label-text-color: var(--mat-text-color);
        --mdc-chip-with-icon-icon-color: rgba(var(--mat-text-color), 0.54);
        --mdc-chip-with-trailing-icon-trailing-icon-color: rgba(var(--mat-text-color), 0.54);
        --mdc-chip-with-icon-selected-icon-color: var(--mat-text-color);
        --mdc-chip-with-trailing-icon-disabled-trailing-icon-color: var(--mat-text-color);
        --mdc-chip-with-trailing-icon-trailing-icon-color: var(--mat-text-color);
    }

    .mat-mdc-chip.mat-mdc-standard-chip {
        /* size */
        --mdc-chip-container-height: 32px;
        --mdc-chip-with-avatar-avatar-size: 24px;
        --mdc-chip-with-avatar-avatar-shape-radius: 50%;
        --mdc-chip-text-label-text-size: var(--font-size-14);
        --mdc-chip-text-label-text-weight: var(--font-weight-medium);
        --mdc-chip-text-label-text-font: var(--font-family);
        --mdc-chip-label-text-font: var(--font-family);
        --mdc-chip-label-text-line-height: var(--line-height-20);
        --mdc-chip-label-text-size: var(--font-size-14);
        --mdc-chip-label-text-tracking: 0.0178571429em;
        --mdc-chip-label-text-weight: var(--font-weight-regular);
    }

    html {
        /* default/primary color */
        --mat-datepicker-calendar-date-selected-state-text-color: var(--mat-primary-contrast-color);
        --mat-datepicker-calendar-date-selected-state-background-color: var(--theme-primary-color);
        --mat-datepicker-calendar-date-selected-disabled-state-background-color: rgba(var(--mat-text-primary-rgb), 0.4);
        --mat-datepicker-calendar-date-today-selected-state-outline-color: var(--mat-primary-contrast-color);
        --mat-datepicker-calendar-date-focus-state-background-color: rgba(var(--mat-text-primary-rgb), 0.3);
        --mat-datepicker-calendar-date-hover-state-background-color: rgba(var(--mat-text-primary-rgb), 0.3);
        --mat-datepicker-toggle-active-state-icon-color: var(--theme-accent-color);
        --mat-datepicker-calendar-date-in-range-state-background-color: rgba(var(--mat-accent-color-rgb), 0.2);
        --mat-datepicker-calendar-date-in-comparison-range-state-background-color: rgba(var(--mat-warn-color-rgb), 0.2);
        --mat-datepicker-calendar-date-in-overlap-range-state-background-color: rgba(var(--mat-success-color-rgb), 0.3);
        --mat-datepicker-calendar-date-in-overlap-range-selected-state-background-color: var(--mat-success-color);
        --mat-datepicker-toggle-icon-color: var(--mat-text-color);
        --mat-datepicker-calendar-body-label-text-color: rgba(var(--mat-text-color), 0.7);
        --mat-datepicker-calendar-period-button-text-color: rgba(var(--mat-text-color), 0.7);
        --mat-datepicker-calendar-navigation-button-icon-color: rgba(var(--mat-text-color), 0.7);
        --mat-datepicker-calendar-header-divider-color: rgba(var(--mat-text-color), 0.12);
        --mat-datepicker-calendar-header-text-color: rgba(var(--mat-text-color), 0.7);
        --mat-datepicker-calendar-date-today-outline-color: rgba(var(--mat-text-color-rgb), 0.5);
        --mat-datepicker-calendar-table-header-text-color: rgba(var(--mat-text-color), 0.5);
        --mat-datepicker-calendar-date-text-color: var(--mat-text-color);
        --mat-datepicker-calendar-date-outline-color: var(--mat-transparent-color);
        --mat-datepicker-calendar-date-disabled-state-text-color: var(--mat-disabled-color);
        --mat-datepicker-calendar-date-preview-state-outline-color: rgba(var(--mat-text-primary-rgb), 0.24);
        --mat-datepicker-calendar-date-today-outline-color: rgba(var(--mat-text-color), 0.5);
        --mat-datepicker-range-input-disabled-state-separator-color: var(--mat-disabled-color);
        --mat-datepicker-range-input-disabled-state-text-color: var(--mat-disabled-color);
        --mat-datepicker-calendar-container-background-color: var(--mat-background-color);
        --mat-datepicker-calendar-container-text-color: var(--mat-text-color);

        /* typography */
        --mat-datepicker-calendar-text-font: var(--font-family);
        --mat-datepicker-calendar-text-size: var(--font-size-13);
        --mat-datepicker-calendar-body-label-text-size: var(--font-size-14);
        --mat-datepicker-calendar-period-button-text-font: var(--font-family);
        --mat-datepicker-calendar-period-button-text-size: var(--font-size-14);
        --mat-datepicker-calendar-period-button-text-weight: var(--font-weight-medium);
        --mat-datepicker-calendar-header-text-font: var(--font-family);
        --mat-datepicker-calendar-header-text-size: var(--font-size-11);
        --mat-datepicker-calendar-header-text-weight: var(--font-weight-regular);
    }

    .mat-datepicker-content.mat-accent {
        /* accent color */
        --mat-datepicker-calendar-date-selected-state-text-color: var(--mat-accent-contrast-color);
        --mat-datepicker-calendar-date-selected-state-background-color: var(--theme-accent-color);
        --mat-datepicker-calendar-date-selected-disabled-state-background-color: rgba(var(--mat-accent-color-rgb), 0.4);
        --mat-datepicker-calendar-date-today-selected-state-outline-color: var(--mat-accent-contrast-color);
        --mat-datepicker-calendar-date-focus-state-background-color: rgba(var(--mat-accent-color-rgb), 0.3);
        --mat-datepicker-calendar-date-hover-state-background-color: rgba(var(--mat-accent-color-rgb), 0.3);
        --mat-datepicker-calendar-date-in-range-state-background-color: rgba(var(--mat-accent-color-rgb), 0.2);
        --mat-datepicker-calendar-date-in-comparison-range-state-background-color: rgba(var(--mat-warn-color-rgb), 0.2);
        --mat-datepicker-calendar-date-in-overlap-range-state-background-color: rgba(var(--mat-success-color-rgb), 0.3);
        --mat-datepicker-calendar-date-in-overlap-range-selected-state-background-color: var(--mat-success-color);
    }

    .mat-datepicker-content.mat-warn {
        /* warn color */
        --mat-datepicker-calendar-date-selected-state-text-color: var(--mat-warn-contrast-color);
        --mat-datepicker-calendar-date-selected-state-background-color: var(--theme-warn-color);
        --mat-datepicker-calendar-date-selected-disabled-state-background-color: rgba(var(--mat-warn-color-rgb), 0.4);
        --mat-datepicker-calendar-date-today-selected-state-outline-color: var(--mat-warn-contrast-color);
        --mat-datepicker-calendar-date-focus-state-background-color: rgba(var(--mat-warn-color-rgb), 0.3);
        --mat-datepicker-calendar-date-hover-state-background-color: rgba(var(--mat-warn-color-rgb), 0.3);
        --mat-datepicker-toggle-active-state-icon-color: var(--theme-warn-color);
        --mat-datepicker-calendar-date-in-range-state-background-color: rgba(var(--mat-warn-color-rgb), 0.2);
        --mat-datepicker-calendar-date-in-overlap-range-state-background-color: rgba(var(--mat-success-color-rgb), 0.3);
        --mat-datepicker-calendar-date-in-overlap-range-selected-state-background-color: var(--mat-success-color);
    }

    .mat-datepicker-toggle-active.mat-accent {
        /* accent color */
        --mat-datepicker-toggle-active-state-icon-color: var(--theme-accent-color);
    }

    .mat-datepicker-toggle-active.mat-warn {
        /* warn color */
        --mat-datepicker-toggle-active-state-icon-color: var(--theme-warn-color);
    }

    .mat-calendar-controls .mat-mdc-icon-button.mat-mdc-button-base {
        /* icon size */
        --mdc-icon-button-state-layer-size: 40px;
    }

    html {
        /* shadows */
        --mdc-dialog-container-elevation-shadow: var(--mat-elevation-24);
        --mdc-dialog-container-shadow-color: var(--mat-shadow-color);

        /* border-radius */
        --mdc-dialog-container-shape: var(--border-radius-4);

        /* colors */
        --mdc-dialog-container-color: var(--mat-dialog-background-color);
        --mdc-dialog-subhead-color: var(--mat-text-color);
        --mdc-dialog-supporting-text-color: rgba(var(--mat-text-color), 0.6);

        /* typography */
        --mdc-dialog-headline-font: var(--font-family);
        --mdc-dialog-headline-line-height: var(--line-height-32);
        --mdc-dialog-headline-size: var(--font-size-24);
        --mdc-dialog-headline-weight: var(--font-weight-regular);
        --mdc-dialog-supporting-text-font: var(--font-family);
        --mdc-dialog-supporting-text-line-height: var(--line-height-20);
        --mdc-dialog-supporting-text-size: var(--font-size-14);
        --mdc-dialog-supporting-text-weight: var(--font-weight-regular);
        --mdc-dialog-supporting-text-tracking: 0.0178571429em;
    }

    html {
        --mat-divider-width: 1px;
        --mat-divider-color: rgba(var(--mat-text-color), 0.12);
    }

    html {
        /* border radius */
        --mat-expansion-container-shape: var(--border-radius-4);
        /* colors */
        --mat-expansion-container-background-color: var(--mat-background-color);
        --mat-expansion-container-text-color: var(--mat-text-color);
        --mat-expansion-header-disabled-state-text-color: var(--mat-disabled-color);
        --mat-expansion-header-text-color: var(--mat-text-color);
        --mat-expansion-header-description-color: rgba(var(--mat-text-color), 0.54);
        --mat-expansion-header-indicator-color: rgba(var(--mat-text-color), 0.54);
        /* height */
        --mat-expansion-header-collapsed-state-height: 48px;
        --mat-expansion-header-expanded-state-height: 64px;
        /* typography */
        --mat-expansion-header-text-font: var(--font-family);
        --mat-expansion-header-text-size: var(--font-size-15);
        --mat-expansion-header-text-weight: var(--font-weight-regular);
        --mat-expansion-container-text-font: var(--font-family);
        --mat-expansion-container-text-line-height: var(--line-height-20);
        --mat-expansion-container-text-size: var(--font-size-14);
        --mat-expansion-container-text-tracking: 0.0178571429em;
        --mat-expansion-container-text-weight: var(--font-weight-regular);
    }

    html {
        /* default/primary color */
        --mat-form-field-focus-select-arrow-color: var(--theme-primary-color);
        --mat-form-field-disabled-input-text-placeholder-color: var(--mat-disabled-color);
        --mat-form-field-state-layer-color: var(--mat-text-color);
        --mat-form-field-error-text-color: var(--theme-warn-color);
        --mat-form-field-select-option-text-color: var(--mat-text-color);
        --mat-form-field-select-disabled-option-text-color: var(--mat-disabled-color);
        --mat-form-field-enabled-select-arrow-color: rgba(var(--mat-text-color), 0.54);
        --mat-form-field-disabled-select-arrow-color: var(--mat-disabled-color);
        --mat-form-field-hover-state-layer-opacity: var(--mat-hover-opacity);
        --mat-form-field-focus-state-layer-opacity: var(--mat-focus-opacity);

        /* size */
        --mat-form-field-container-height: 56px;
        --mat-form-field-filled-label-display: block;
        --mat-form-field-container-vertical-padding: 16px;
        --mat-form-field-filled-with-label-container-padding-top: 24px;
        --mat-form-field-filled-with-label-container-padding-bottom: 8px;

        /* colors */
        --mat-form-field-container-text-color: var(--mat-text-color);
        --mat-form-field-disabled-input-text-color: var(--mat-disabled-color);
        --mat-form-field-input-text-placeholder-color: rgba(var(--mat-text-color), 0.6);
        --mat-form-field-label-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-form-field-subscript-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-form-field-outlined-label-text-populated-size: var(--font-size-12);
        --mat-form-field-outlined-label-text-populated-weight: var(--font-weight-regular);
        --mat-form-field-subscript-text-font: var(--font-family);
        --mat-form-field-subscript-text-line-height: var(--line-height-20);
        --mat-form-field-subscript-text-size: var(--font-size-12);
        --mat-form-field-subscript-text-weight: var(--font-weight-regular);
        --mat-form-field-subscript-text-tracking: 0.0333333333em;
    }

    .mat-mdc-form-field.mat-accent {
        /* accent color */
        --mat-form-field-focus-select-arrow-color: var(--theme-accent-color);
    }

    .mat-mdc-form-field.mat-warn {
        /* warn color */
        --mat-form-field-focus-select-arrow-color: var(--theme-warn-color);
    }

    html {
        /* size */
        --mdc-filled-text-field-active-indicator-height: 1px;
        --mdc-filled-text-field-focus-active-indicator-height: 2px;
        --mdc-filled-text-field-container-shape: var(--border-radius-4);

        /* primary/default color */
        --mdc-filled-text-field-caret-color: var(--theme-primary-color);
        --mdc-filled-text-field-focus-active-indicator-color: var(--theme-primary-color);
        --mdc-filled-text-field-focus-label-text-color: var(--theme-primary-color);
        --mdc-filled-text-field-container-color: var(--mat-form-field-background-color);
        --mdc-filled-text-field-disabled-container-color: var(--mat-form-field-disabled-background-color);
        --mdc-filled-text-field-label-text-color: rgba(var(--mat-text-color), 0.6);
        --mdc-filled-text-field-disabled-label-text-color: var(--mat-disabled-color);
        --mdc-filled-text-field-input-text-color: var(--mat-text-color);
        --mdc-filled-text-field-disabled-input-text-color: var(--mat-disabled-color);
        --mdc-filled-text-field-input-text-placeholder-color: rgba(var(--mat-text-color), 0.6);
        --mdc-filled-text-field-error-focus-label-text-color: var(--theme-warn-color);
        --mdc-filled-text-field-error-label-text-color: var(--theme-warn-color);
        --mdc-filled-text-field-error-caret-color: var(--theme-warn-color);
        --mdc-filled-text-field-active-indicator-color: rgba(var(--mat-text-color), 0.42);
        --mdc-filled-text-field-disabled-active-indicator-color: rgba(var(--mat-text-color), 0.06);
        --mdc-filled-text-field-hover-active-indicator-color: var(--mat-text-color);
        --mdc-filled-text-field-error-active-indicator-color: var(--theme-warn-color);
        --mdc-filled-text-field-error-focus-active-indicator-color: var(--theme-warn-color);
        --mdc-filled-text-field-error-hover-active-indicator-color: var(--theme-warn-color);

        /* typography */
        --mdc-filled-text-field-label-text-font: var(--font-family);
        --mdc-filled-text-field-label-text-size: var(--font-size-16);
        --mdc-filled-text-field-label-text-tracking: 0.03125em;
        --mdc-filled-text-field-label-text-weight: var(--font-weight-regular);
    }

    .mat-mdc-form-field.mat-accent {
        /* accent color */
        --mdc-filled-text-field-caret-color: var(--theme-accent-color);
        --mdc-filled-text-field-focus-active-indicator-color: var(--theme-accent-color);
        --mdc-filled-text-field-focus-label-text-color: var(--theme-accent-color);
    }

    .mat-mdc-form-field.mat-warn {
        /* warn color */
        --mdc-filled-text-field-caret-color: var(--theme-warn-color);
        --mdc-filled-text-field-focus-active-indicator-color: var(--theme-warn-color);
        --mdc-filled-text-field-focus-label-text-color: var(--theme-warn-color);
    }

    html {
        /* outline size */
        --mdc-outlined-text-field-outline-width: 1px;
        --mdc-outlined-text-field-focus-outline-width: 2px;

        /* border-radius */
        --mdc-outlined-text-field-container-shape: var(--border-radius-4);

        /* primary/default color */
        --mdc-outlined-text-field-caret-color: var(--theme-primary-color);
        --mdc-outlined-text-field-focus-outline-color: var(--theme-primary-color);
        --mdc-outlined-text-field-focus-label-text-color: var(--theme-primary-color);
        --mdc-outlined-text-field-label-text-color: rgba(var(--mat-text-color), 0.6);
        --mdc-outlined-text-field-disabled-label-text-color: var(--mat-disabled-color);
        --mdc-outlined-text-field-input-text-color: var(--mat-text-color);
        --mdc-outlined-text-field-disabled-input-text-color: var(--mat-disabled-color);
        --mdc-outlined-text-field-input-text-placeholder-color: rgba(var(--mat-text-color), 0.6);
        --mdc-outlined-text-field-error-caret-color: var(--theme-warn-color);
        --mdc-outlined-text-field-error-focus-label-text-color: var(--theme-warn-color);
        --mdc-outlined-text-field-error-label-text-color: var(--theme-warn-color);
        --mdc-outlined-text-field-outline-color: rgba(var(--mat-text-color), 0.38);
        --mdc-outlined-text-field-disabled-outline-color: rgba(var(--mat-text-color), 0.06);
        --mdc-outlined-text-field-hover-outline-color: var(--mat-text-color);
        --mdc-outlined-text-field-error-focus-outline-color: var(--theme-warn-color);
        --mdc-outlined-text-field-error-hover-outline-color: var(--theme-warn-color);
        --mdc-outlined-text-field-error-outline-color: var(--theme-warn-color);

        /* typography */
        --mdc-outlined-text-field-label-text-font: var(--font-family);
        --mdc-outlined-text-field-label-text-size: var(--font-size-16);
        --mdc-outlined-text-field-label-text-tracking: 0.03125em;
        --mdc-outlined-text-field-label-text-weight: var(--font-weight-regular);
    }

    .mat-mdc-form-field.mat-accent {
        /* accent color */
        --mdc-outlined-text-field-caret-color: var(--theme-accent-color);
        --mdc-outlined-text-field-focus-outline-color: var(--theme-accent-color);
        --mdc-outlined-text-field-focus-label-text-color: var(--theme-accent-color);
    }

    .mat-mdc-form-field.mat-warn {
        /* warn color */
        --mdc-outlined-text-field-caret-color: var(--theme-warn-color);
        --mdc-outlined-text-field-focus-outline-color: var(--theme-warn-color);
        --mdc-outlined-text-field-focus-label-text-color: var(--theme-warn-color);
    }

    html {
        /* font-size */
        --mat-grid-list-tile-header-primary-text-size: var(--font-size-14);
        --mat-grid-list-tile-header-secondary-text-size: var(--font-size-12);
        --mat-grid-list-tile-footer-primary-text-size: var(--font-size-14);
        --mat-grid-list-tile-footer-secondary-text-size: var(--font-size-12);
    }

    .mat-icon.mat-primary {
        --mat-icon-color: var(--theme-primary-color);
    }

    .mat-icon.mat-accent {
        --mat-icon-color: var(--theme-accent-color);
    }

    .mat-icon.mat-warn {
        --mat-icon-color: var(--theme-warn-color);
    }

    html {
        /* height */
        --mdc-list-list-item-one-line-container-height: 48px;
        --mdc-list-list-item-two-line-container-height: 64px;
        --mdc-list-list-item-three-line-container-height: 88px;

        /* shape */
        --mdc-list-list-item-container-shape: 0;
        --mdc-list-list-item-leading-avatar-shape: 50%;

        /* icon size */
        --mdc-list-list-item-leading-icon-size: 24px;
        --mdc-list-list-item-leading-avatar-size: 40px;
        --mdc-list-list-item-trailing-icon-size: 24px;

        /* opacity */
        --mdc-list-list-item-disabled-state-layer-opacity: 0;
        --mdc-list-list-item-disabled-label-text-opacity: 0.38;
        --mdc-list-list-item-disabled-leading-icon-opacity: 0.38;
        --mdc-list-list-item-disabled-trailing-icon-opacity: var(--mat-disabled-opacity);
        --mdc-list-list-item-hover-state-layer-opacity: var(--mat-hover-opacity);

        /* colors */
        --mdc-list-list-item-trailing-supporting-text-color: rgba(var(--mat-text-color), 0.54);
        --mdc-list-list-item-trailing-icon-color: rgba(var(--mat-text-color), 0.54);
        --mdc-list-list-item-selected-trailing-icon-color: var(--theme-primary-color);
        --mdc-list-list-item-disabled-state-layer-color: var(--mat-transparent-color);
        --mdc-list-list-item-disabled-state-layer-opacity: 0;
        --mdc-list-list-item-disabled-label-text-opacity: var(--mat-disabled-opacity);
        --mdc-list-list-item-disabled-leading-icon-opacity: var(--mat-disabled-opacity);
        --mdc-list-list-item-label-text-color: var(--mat-text-color);
        --mdc-list-list-item-supporting-text-color: rgba(var(--mat-text-color), 0.54);
        --mdc-list-list-item-leading-icon-color: rgba(var(--mat-text-color), 0.54);
        --mdc-list-list-item-hover-state-layer-color: rgba(var(--mat-text-color), var(--mat-hover-opacity));
        --mdc-list-list-item-hover-state-layer-opacity: 1;
        --mdc-list-list-item-focus-state-layer-color: rgba(var(--mat-text-color), var(--mat-focus-opacity));
        --mdc-list-list-item-focus-state-layer-opacity: 1;

        /* optgroup typography */
        --mat-optgroup-label-text-font: var(--font-family);
        --mat-optgroup-label-text-line-height: var(--line-height-20);
        --mat-optgroup-label-text-size: var(--font-size-14);
        --mat-optgroup-label-text-tracking: 0.0178571429em;
        --mat-optgroup-label-text-weight: var(--font-weight-regular);
    }

    html {
        /* typography */
        --mdc-list-list-item-label-text-font: var(--font-family);
        --mdc-list-list-item-label-text-line-height: var(--line-height-24);
        --mdc-list-list-item-label-text-size: var(--font-size-16);
        --mdc-list-list-item-label-text-tracking: 0.03125em;
        --mdc-list-list-item-label-text-weight: var(--font-weight-regular);
        --mdc-list-list-item-supporting-text-font: var(--font-family);
        --mdc-list-list-item-supporting-text-line-height: var(--line-height-20);
        --mdc-list-list-item-supporting-text-size: var(--font-size-14);
        --mdc-list-list-item-supporting-text-tracking: 0.0178571429em;
        --mdc-list-list-item-supporting-text-weight: var(--font-weight-regular);
        --mdc-list-list-item-trailing-supporting-text-font: var(--font-family);
        --mdc-list-list-item-trailing-supporting-text-line-height: var(--line-height-20);
        --mdc-list-list-item-trailing-supporting-text-size: var(--font-size-14);
        --mdc-list-list-item-trailing-supporting-text-tracking: 0.0178571429em;
        --mdc-list-list-item-trailing-supporting-text-weight: var(--font-weight-regular);

        /* color */
        --mat-paginator-container-text-color: var(--mat-text-color);
        --mat-paginator-container-background-color: var(--mat-background-color);
        --mat-paginator-enabled-icon-color: rgba(var(--mat-text-color), 0.54);
        --mat-paginator-disabled-icon-color: rgba(var(--mat-text-color), 0.12);

        /* size */
        --mat-paginator-container-size: 56px;

        /* container typography */
        --mat-paginator-container-text-font: var(--font-family);
        --mat-paginator-container-text-line-height: var(--line-height-20);
        --mat-paginator-container-text-size: var(--font-size-12);
        --mat-paginator-container-text-tracking: 0.0333333333em;
        --mat-paginator-container-text-weight: var(--font-weight-regular);
        --mat-paginator-select-trigger-text-size: var(--font-size-12);
    }

    .mat-mdc-paginator {
        /* page selection input */
        --mat-form-field-container-height: 40px;
        --mat-form-field-filled-label-display: none;
        --mat-form-field-container-vertical-padding: 8px;
        --mat-form-field-filled-with-label-container-padding-top: 8px;
        --mat-form-field-filled-with-label-container-padding-bottom: 8px;
    }

    html {
        /* size */
        --mdc-linear-progress-active-indicator-height: 4px;
        --mdc-linear-progress-track-height: 4px;

        /* border-radius */
        --mdc-linear-progress-track-shape: 0;
    }

    .mat-mdc-progress-bar {
        /* default/primary color */
        --mdc-linear-progress-active-indicator-color: var(--theme-primary-color);
        --mdc-linear-progress-track-color: rgba(var(--mat-text-primary-rgb), 0.25);
    }

    .mat-mdc-progress-bar.mat-accent {
        /* accent color */
        --mdc-linear-progress-active-indicator-color: var(--theme-accent-color);
        --mdc-linear-progress-track-color: rgba(var(--mat-accent-color-rgb), 0.25);
    }

    .mat-mdc-progress-bar.mat-warn {
        /* warn color */
        --mdc-linear-progress-active-indicator-color: var(--theme-warn-color);
        --mdc-linear-progress-track-color: rgba(var(--mat-warn-color-rgb), 0.25);
    }

    html {
        --mdc-circular-progress-active-indicator-width: 4px;
        --mdc-circular-progress-size: 48px;
        --mdc-circular-progress-active-indicator-color: var(--theme-primary-color);
    }

    .mat-mdc-progress-spinner.mat-accent {
        --mdc-circular-progress-active-indicator-color: var(--theme-accent-color);
    }

    .mat-mdc-progress-spinner.mat-warn {
        --mdc-circular-progress-active-indicator-color: var(--theme-warn-color);
    }

    .mat-primary {
        --mat-full-pseudo-checkbox-selected-icon-color: var(--theme-primary-color);
        --mat-full-pseudo-checkbox-selected-checkmark-color: var(--mat-background-color);
        --mat-full-pseudo-checkbox-unselected-icon-color: rgba(var(--mat-text-color), 0.7);
        --mat-full-pseudo-checkbox-disabled-selected-checkmark-color: var(--mat-background-color);
        --mat-full-pseudo-checkbox-disabled-unselected-icon-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mat-full-pseudo-checkbox-disabled-selected-icon-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mat-minimal-pseudo-checkbox-selected-checkmark-color: var(--theme-primary-color);
        --mat-minimal-pseudo-checkbox-disabled-selected-checkmark-color: rgba(
            /**
             * Handles var functionality
             */
            var(--mat-text-color),
            /**
             * Handles var functionality
             */
            var(--mat-disabled-opacity)
        );
    }

    .mat-accent {
        --mat-full-pseudo-checkbox-selected-icon-color: var(--theme-accent-color);
        --mat-full-pseudo-checkbox-selected-checkmark-color: var(--mat-background-color);
        --mat-full-pseudo-checkbox-unselected-icon-color: rgba(var(--mat-text-color), 0.7);
        --mat-full-pseudo-checkbox-disabled-selected-checkmark-color: var(--mat-background-color);
        --mat-full-pseudo-checkbox-disabled-unselected-icon-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mat-full-pseudo-checkbox-disabled-selected-icon-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mat-minimal-pseudo-checkbox-selected-checkmark-color: var(--theme-accent-color);
        --mat-minimal-pseudo-checkbox-disabled-selected-checkmark-color: rgba(
            /**
             * Handles var functionality
             */
            var(--mat-text-color),
            /**
             * Handles var functionality
             */
            var(--mat-disabled-opacity)
        );
    }

    .mat-warn {
        --mat-full-pseudo-checkbox-selected-icon-color: var(--theme-warn-color);
        --mat-full-pseudo-checkbox-selected-checkmark-color: var(--mat-background-color);
        --mat-full-pseudo-checkbox-unselected-icon-color: rgba(var(--mat-text-color), 0.7);
        --mat-full-pseudo-checkbox-disabled-selected-checkmark-color: var(--mat-background-color);
        --mat-full-pseudo-checkbox-disabled-unselected-icon-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mat-full-pseudo-checkbox-disabled-selected-icon-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mat-minimal-pseudo-checkbox-selected-checkmark-color: var(--theme-warn-color);
        --mat-minimal-pseudo-checkbox-disabled-selected-checkmark-color: rgba(
            /**
             * Handles var functionality
             */
            var(--mat-text-color),
            /**
             * Handles var functionality
             */
            var(--mat-disabled-opacity)
        );
    }

    html {
        --mdc-radio-disabled-selected-icon-opacity: var(--mat-disabled-opacity);
        --mdc-radio-disabled-unselected-icon-opacity: var(--mat-disabled-opacity);
        --mdc-radio-state-layer-size: 40px;
    }

    .mat-mdc-radio-button.mat-primary {
        --mdc-radio-disabled-selected-icon-color: var(--mat-text-color);
        --mdc-radio-disabled-unselected-icon-color: var(--mat-text-color);
        --mdc-radio-unselected-hover-icon-color: var(--mat-text-color);
        --mdc-radio-unselected-icon-color: rgba(var(--mat-text-color), 0.54);
        --mdc-radio-unselected-pressed-icon-color: rgba(var(--mat-text-color), 0.54);
        --mdc-radio-selected-focus-icon-color: var(--theme-primary-color);
        --mdc-radio-selected-hover-icon-color: var(--theme-primary-color);
        --mdc-radio-selected-icon-color: var(--theme-primary-color);
        --mdc-radio-selected-pressed-icon-color: var(--theme-primary-color);
        --mat-radio-ripple-color: var(--mat-text-color);
        --mat-radio-checked-ripple-color: var(--theme-primary-color);
        --mat-radio-disabled-label-color: rgba(var(--mat-text-color), 0.5);
    }

    .mat-mdc-radio-button.mat-accent {
        --mdc-radio-disabled-selected-icon-color: var(--mat-text-color);
        --mdc-radio-disabled-unselected-icon-color: var(--mat-text-color);
        --mdc-radio-unselected-hover-icon-color: var(--mat-text-color);
        --mdc-radio-unselected-icon-color: rgba(var(--mat-text-color), 0.54);
        --mdc-radio-unselected-pressed-icon-color: rgba(var(--mat-text-color), 0.54);
        --mdc-radio-selected-focus-icon-color: var(--theme-accent-color);
        --mdc-radio-selected-hover-icon-color: var(--theme-accent-color);
        --mdc-radio-selected-icon-color: var(--theme-accent-color);
        --mdc-radio-selected-pressed-icon-color: var(--theme-accent-color);
        --mat-radio-ripple-color: var(--mat-text-color);
        --mat-radio-checked-ripple-color: var(--theme-accent-color);
        --mat-radio-disabled-label-color: rgba(var(--mat-text-color), 0.5);
    }

    .mat-mdc-radio-button.mat-warn {
        --mdc-radio-disabled-selected-icon-color: var(--mat-text-color);
        --mdc-radio-disabled-unselected-icon-color: var(--mat-text-color);
        --mdc-radio-unselected-hover-icon-color: var(--mat-text-color);
        --mdc-radio-unselected-icon-color: rgba(var(--mat-text-color), 0.54);
        --mdc-radio-unselected-pressed-icon-color: rgba(var(--mat-text-color), 0.54);
        --mdc-radio-selected-focus-icon-color: var(--theme-warn-color);
        --mdc-radio-selected-hover-icon-color: var(--theme-warn-color);
        --mdc-radio-selected-icon-color: var(--theme-warn-color);
        --mdc-radio-selected-pressed-icon-color: var(--theme-warn-color);
        --mat-radio-ripple-color: var(--mat-text-color);
        --mat-radio-checked-ripple-color: var(--theme-warn-color);
        --mat-radio-disabled-label-color: rgba(var(--mat-text-color), 0.5);
    }

    html {
        --mat-ripple-color: rgba(var(--mat-text-color), 0.1);
    }

    html {
        /* default/primary color */
        --mat-select-panel-background-color: var(--mat-background-color);
        --mat-select-enabled-trigger-text-color: var(--mat-text-color);
        --mat-select-disabled-trigger-text-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mat-select-placeholder-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-select-enabled-arrow-color: rgba(var(--mat-text-color), 0.54);
        --mat-select-disabled-arrow-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mat-select-focused-arrow-color: var(--theme-primary-color);
        --mat-select-invalid-arrow-color: var(--theme-warn-color);

        /* typography */
        --mat-select-trigger-text-font: var(--font-family);
        --mat-select-trigger-text-line-height: var(--line-height-24);
        --mat-select-trigger-text-size: var(--font-size-16);
        --mat-select-trigger-text-tracking: 0.03125em;
        --mat-select-trigger-text-weight: var(--font-weight-regular);
    }

    .mat-mdc-form-field.mat-accent {
        /* accent color */
        --mat-select-panel-background-color: var(--mat-background-color);
        --mat-select-enabled-trigger-text-color: var(--mat-text-color);
        --mat-select-disabled-trigger-text-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mat-select-placeholder-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-select-enabled-arrow-color: rgba(var(--mat-text-color), 0.54);
        --mat-select-disabled-arrow-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mat-select-focused-arrow-color: var(--theme-accent-color);
        --mat-select-invalid-arrow-color: var(--theme-warn-color);
    }

    .mat-mdc-form-field.mat-warn {
        /* warn color */
        --mat-select-panel-background-color: var(--mat-background-color);
        --mat-select-enabled-trigger-text-color: var(--mat-text-color);
        --mat-select-disabled-trigger-text-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mat-select-placeholder-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-select-enabled-arrow-color: rgba(var(--mat-text-color), 0.54);
        --mat-select-disabled-arrow-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mat-select-focused-arrow-color: var(--theme-warn-color);
        --mat-select-invalid-arrow-color: var(--theme-warn-color);
    }

    html {
        --mat-sidenav-container-divider-color: rgba(var(--mat-text-color), 0.12);
        --mat-sidenav-container-background-color: var(--mat-background-color);
        --mat-sidenav-container-text-color: var(--mat-text-color);
        --mat-sidenav-content-background-color: var(--mat-background-color);
        --mat-sidenav-content-text-color: var(--mat-text-color);
        --mat-sidenav-scrim-color: rgba(var(--mat-text-color), 0.6);
    }

    .mdc-switch {
        /* disabled opacity */
        --mdc-switch-disabled-handle-opacity: var(--mat-disabled-opacity);
        --mdc-switch-disabled-selected-icon-opacity: var(--mat-disabled-opacity);
        --mdc-switch-disabled-track-opacity: 0.12;
        --mdc-switch-disabled-unselected-icon-opacity: var(--mat-disabled-opacity);

        /* size */
        --mdc-switch-handle-height: 20px;
        --mdc-switch-handle-shape: 10px;
        --mdc-switch-handle-width: 20px;
        --mdc-switch-selected-icon-size: 18px;
        --mdc-switch-track-height: 14px;
        --mdc-switch-track-shape: 7px;
        --mdc-switch-track-width: 36px;
        --mdc-switch-unselected-icon-size: 18px;
        --mdc-switch-state-layer-size: 40px;

        /* focus/hover/active opacity */
        --mdc-switch-selected-focus-state-layer-opacity: var(--mat-focus-opacity);
        --mdc-switch-selected-hover-state-layer-opacity: var(--mat-hover-opacity);
        --mdc-switch-selected-pressed-state-layer-opacity: var(--mat-pressed-opacity);
        --mdc-switch-unselected-focus-state-layer-opacity: var(--mat-focus-opacity);
        --mdc-switch-unselected-hover-state-layer-opacity: var(--mat-hover-opacity);
        --mdc-switch-unselected-pressed-state-layer-opacity: var(--mat-pressed-opacity);
    }

    .mat-mdc-slide-toggle {
        /* default/primary color */
        --mdc-switch-selected-focus-state-layer-color: var(--theme-primary-color);
        --mdc-switch-selected-handle-color: var(--theme-primary-color);
        --mdc-switch-selected-hover-state-layer-color: var(--theme-primary-color);
        --mdc-switch-selected-pressed-state-layer-color: var(--theme-primary-color);
        --mdc-switch-selected-focus-handle-color: var(--theme-primary-color);
        --mdc-switch-selected-hover-handle-color: var(--theme-primary-color);
        --mdc-switch-selected-pressed-handle-color: var(--theme-primary-color);
        --mdc-switch-selected-focus-track-color: var(--theme-primary-color);
        --mdc-switch-selected-hover-track-color: var(--theme-primary-color);
        --mdc-switch-selected-pressed-track-color: var(--theme-primary-color);
        --mdc-switch-selected-track-color: var(--theme-primary-color);
        --mdc-switch-disabled-selected-handle-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mdc-switch-disabled-selected-icon-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mdc-switch-disabled-selected-track-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mdc-switch-disabled-unselected-handle-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mdc-switch-disabled-unselected-icon-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mdc-switch-disabled-unselected-track-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mdc-switch-handle-surface-color: var(--mat-background-color);
        --mdc-switch-handle-elevation-shadow: var(--mat-elevation-2);
        --mdc-switch-handle-shadow-color: var(--mat-shadow-color);
        --mdc-switch-disabled-handle-elevation-shadow: var(--mat-elevation-0);
        --mdc-switch-selected-icon-color: var(--mat-text-color);
        --mdc-switch-unselected-focus-handle-color: var(--mat-text-color);
        --mdc-switch-unselected-focus-state-layer-color: rgba(var(--mat-text-color), var(--mat-focus-opacity));
        --mdc-switch-unselected-focus-track-color: rgba(var(--mat-text-color), 0.54);
        --mdc-switch-unselected-handle-color: rgba(var(--mat-text-color), 0.54);
        --mdc-switch-unselected-hover-handle-color: var(--mat-text-color);
        --mdc-switch-unselected-hover-state-layer-color: rgba(var(--mat-text-color), var(--mat-hover-opacity));
        --mdc-switch-unselected-hover-track-color: rgba(var(--mat-text-color), 0.54);
        --mdc-switch-unselected-icon-color: var(--mat-text-color);
        --mdc-switch-unselected-pressed-handle-color: var(--mat-text-color);
        --mdc-switch-unselected-pressed-state-layer-color: rgba(var(--mat-text-color), var(--mat-pressed-opacity));
        --mdc-switch-unselected-pressed-track-color: rgba(var(--mat-text-color), 0.54);
        --mdc-switch-unselected-track-color: rgba(var(--mat-text-color), 0.54);

        /* size */
        --mdc-switch-state-layer-size: 48px;

        /* typography */
        --mat-slide-toggle-label-text-font: var(--font-family);
        --mat-slide-toggle-label-text-size: var(--font-size-14);
        --mat-slide-toggle-label-text-tracking: 0.0178571429em;
        --mat-slide-toggle-label-text-line-height: var(--line-height-20);
        --mat-slide-toggle-label-text-weight: var(--font-weight-regular);
    }

    .mat-mdc-slide-toggle.mat-accent {
        /* accent color */
        --mdc-switch-selected-focus-state-layer-color: var(--theme-accent-color);
        --mdc-switch-selected-handle-color: var(--theme-accent-color);
        --mdc-switch-selected-hover-state-layer-color: var(--theme-accent-color);
        --mdc-switch-selected-pressed-state-layer-color: var(--theme-accent-color);
        --mdc-switch-selected-focus-handle-color: var(--theme-accent-color);
        --mdc-switch-selected-hover-handle-color: var(--theme-accent-color);
        --mdc-switch-selected-pressed-handle-color: var(--theme-accent-color);
        --mdc-switch-selected-focus-track-color: var(--theme-accent-color);
        --mdc-switch-selected-hover-track-color: var(--theme-accent-color);
        --mdc-switch-selected-pressed-track-color: var(--theme-accent-color);
        --mdc-switch-selected-track-color: var(--theme-accent-color);
    }

    .mat-mdc-slide-toggle.mat-warn {
        /* warn color */
        --mdc-switch-selected-focus-state-layer-color: var(--theme-warn-color);
        --mdc-switch-selected-handle-color: var(--theme-warn-color);
        --mdc-switch-selected-hover-state-layer-color: var(--theme-warn-color);
        --mdc-switch-selected-pressed-state-layer-color: var(--theme-warn-color);
        --mdc-switch-selected-focus-handle-color: var(--theme-warn-color);
        --mdc-switch-selected-hover-handle-color: var(--theme-warn-color);
        --mdc-switch-selected-pressed-handle-color: var(--theme-warn-color);
        --mdc-switch-selected-focus-track-color: var(--theme-warn-color);
        --mdc-switch-selected-hover-track-color: var(--theme-warn-color);
        --mdc-switch-selected-pressed-track-color: var(--theme-warn-color);
        --mdc-switch-selected-track-color: var(--theme-warn-color);
    }

    html {
        /* size */
        --mat-slider-value-indicator-width: auto;
        --mat-slider-value-indicator-height: 32px;
        --mat-slider-value-indicator-caret-display: block;
        --mat-slider-value-indicator-border-radius: 4px;
        --mat-slider-value-indicator-padding: 0 12px;
        --mat-slider-value-indicator-text-transform: none;
        --mat-slider-value-indicator-container-transform: translateX(-50%);
        --mdc-slider-active-track-height: 6px;
        --mdc-slider-active-track-shape: 9999px;
        --mdc-slider-handle-height: 20px;
        --mdc-slider-handle-shape: 50%;
        --mdc-slider-handle-width: 20px;
        --mdc-slider-inactive-track-height: 4px;
        --mdc-slider-inactive-track-shape: 9999px;
        --mdc-slider-with-overlap-handle-outline-width: 1px;
        --mdc-slider-with-tick-marks-active-container-opacity: 0.6;
        --mdc-slider-with-tick-marks-container-shape: 50%;
        --mdc-slider-with-tick-marks-container-size: 2px;
        --mdc-slider-with-tick-marks-inactive-container-opacity: 0.6;

        /* default/primary color */
        --mdc-slider-handle-color: var(--theme-primary-color);
        --mdc-slider-focus-handle-color: var(--theme-primary-color);
        --mdc-slider-hover-handle-color: var(--theme-primary-color);
        --mdc-slider-active-track-color: var(--theme-primary-color);
        --mdc-slider-inactive-track-color: var(--theme-primary-color);
        --mdc-slider-with-tick-marks-inactive-container-color: var(--theme-primary-color);
        --mdc-slider-with-tick-marks-active-container-color: var(--mat-text-color);
        --mdc-slider-disabled-active-track-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mdc-slider-disabled-handle-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mdc-slider-disabled-inactive-track-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mdc-slider-label-container-color: var(--mat-text-color);
        --mdc-slider-label-label-text-color: var(--mat-background-color);
        --mdc-slider-with-overlap-handle-outline-color: var(--mat-text-color);
        --mdc-slider-with-tick-marks-disabled-container-color: rgba(var(--mat-text-color), var(--mat-disabled-opacity));
        --mdc-slider-handle-elevation: var(--mat-elevation-2);
        --mat-mdc-slider-ripple-color: var(--theme-primary-color);
        --mat-mdc-slider-hover-ripple-color: rgba(var(--mat-text-primary-rgb), 0.05);
        --mat-mdc-slider-focus-ripple-color: rgba(var(--mat-text-primary-rgb), 0.2);
        --mat-slider-value-indicator-opacity: 0.9;

        /* typography */
        --mdc-slider-label-label-text-font: var(--font-family);
        --mdc-slider-label-label-text-size: var(--font-size-14);
        --mdc-slider-label-label-text-line-height: var(--line-height-22);
        --mdc-slider-label-label-text-tracking: 0.0071428571em;
        --mdc-slider-label-label-text-weight: var(--font-weight-medium);
    }

    .mat-mdc-slider.mat-accent {
        /* accent color */
        --mdc-slider-handle-color: var(--theme-accent-color);
        --mdc-slider-focus-handle-color: var(--theme-accent-color);
        --mdc-slider-hover-handle-color: var(--theme-accent-color);
        --mdc-slider-active-track-color: var(--theme-accent-color);
        --mdc-slider-inactive-track-color: var(--theme-accent-color);
        --mdc-slider-with-tick-marks-inactive-container-color: var(--theme-accent-color);
        --mdc-slider-with-tick-marks-active-container-color: var(--mat-text-color);
        --mat-mdc-slider-ripple-color: var(--theme-accent-color);
        --mat-mdc-slider-hover-ripple-color: rgba(var(--mat-accent-color-rgb), 0.05);
        --mat-mdc-slider-focus-ripple-color: rgba(var(--mat-accent-color-rgb), 0.2);
    }

    .mat-mdc-slider.mat-warn {
        /* warn color */
        --mdc-slider-handle-color: var(--theme-warn-color);
        --mdc-slider-focus-handle-color: var(--theme-warn-color);
        --mdc-slider-hover-handle-color: var(--theme-warn-color);
        --mdc-slider-active-track-color: var(--theme-warn-color);
        --mdc-slider-inactive-track-color: var(--theme-warn-color);
        --mdc-slider-with-tick-marks-inactive-container-color: var(--theme-warn-color);
        --mdc-slider-with-tick-marks-active-container-color: var(--mat-text-color);
        --mat-mdc-slider-ripple-color: var(--theme-warn-color);
        --mat-mdc-slider-hover-ripple-color: rgba(var(--mat-warn-color-rgb), 0.05);
        --mat-mdc-slider-focus-ripple-color: rgba(var(--mat-warn-color-rgb), 0.2);
    }

    html {
        /* border-radius */
        --mdc-snackbar-container-shape: var(--border-radius-4);

        /* color */
        --mdc-snackbar-container-color: var(--mat-background-color);
        --mdc-snackbar-supporting-text-color: var(--mat-text-color);
        --mat-snack-bar-button-color: var(--mat-text-color);

        /* typography */
        --mdc-snackbar-supporting-text-font: var(--font-family);
        --mdc-snackbar-supporting-text-line-height: var(--line-height-20);
        --mdc-snackbar-supporting-text-size: var(--font-size-14);
        --mdc-snackbar-supporting-text-weight: var(--font-weight-regular);
    }

    html {
        --mat-sort-arrow-color: rgba(var(--mat-text-color), 0.54);
    }

    html {
        /* primary/default color */
        --mat-stepper-header-icon-foreground-color: var(--mat-text-color);
        --mat-stepper-header-selected-state-icon-background-color: var(--theme-primary-color);
        --mat-stepper-header-selected-state-icon-foreground-color: var(--mat-background-color);
        --mat-stepper-header-done-state-icon-background-color: var(--theme-primary-color);
        --mat-stepper-header-done-state-icon-foreground-color: var(--mat-background-color);
        --mat-stepper-header-edit-state-icon-background-color: var(--theme-primary-color);
        --mat-stepper-header-edit-state-icon-foreground-color: var(--mat-background-color);
        --mat-stepper-container-color: var(--mat-background-color);
        --mat-stepper-line-color: rgba(var(--mat-text-color), 0.12);
        --mat-stepper-header-hover-state-layer-color: rgba(var(--mat-text-color), var(--mat-hover-opacity));
        --mat-stepper-header-focus-state-layer-color: rgba(var(--mat-text-color), var(--mat-focus-opacity));
        --mat-stepper-header-label-text-color: rgba(var(--mat-text-color), 0.7);
        --mat-stepper-header-optional-label-text-color: rgba(var(--mat-text-color), 0.7);
        --mat-stepper-header-selected-state-label-text-color: var(--mat-text-color);
        --mat-stepper-header-error-state-label-text-color: var(--theme-warn-color);
        --mat-stepper-header-icon-background-color: rgba(var(--mat-text-color), 0.7);
        --mat-stepper-header-error-state-icon-foreground-color: var(--theme-warn-color);
        --mat-stepper-header-error-state-icon-background-color: var(--mat-transparent-color);

        /* size */
        --mat-stepper-header-height: 72px;

        /* typography */
        --mat-stepper-container-text-font: var(--font-family);
        --mat-stepper-header-label-text-font: var(--font-family);
        --mat-stepper-header-label-text-size: var(--font-size-14);
        --mat-stepper-header-label-text-weight: var(--font-weight-regular);
        --mat-stepper-header-error-state-label-text-size: var(--font-size-16);
        --mat-stepper-header-selected-state-label-text-size: var(--font-size-16);
        --mat-stepper-header-selected-state-label-text-weight: var(--font-weight-regular);
    }

    .mat-step-header.mat-accent {
        /* accent color */
        --mat-stepper-header-icon-foreground-color: var(--mat-text-color);
        --mat-stepper-header-selected-state-icon-background-color: var(--theme-accent-color);
        --mat-stepper-header-selected-state-icon-foreground-color: var(--mat-background-color);
        --mat-stepper-header-done-state-icon-background-color: var(--theme-accent-color);
        --mat-stepper-header-done-state-icon-foreground-color: var(--mat-background-color);
        --mat-stepper-header-edit-state-icon-background-color: var(--theme-accent-color);
        --mat-stepper-header-edit-state-icon-foreground-color: var(--mat-background-color);
    }

    .mat-step-header.mat-warn {
        /* warn color */
        --mat-stepper-header-icon-foreground-color: var(--mat-text-color);
        --mat-stepper-header-selected-state-icon-background-color: var(--theme-warn-color);
        --mat-stepper-header-selected-state-icon-foreground-color: var(--mat-background-color);
        --mat-stepper-header-done-state-icon-background-color: var(--theme-warn-color);
        --mat-stepper-header-done-state-icon-foreground-color: var(--mat-background-color);
        --mat-stepper-header-edit-state-icon-background-color: var(--theme-warn-color);
        --mat-stepper-header-edit-state-icon-foreground-color: var(--mat-background-color);
    }

    html {
        /* color */
        --mat-table-background-color: var(--mat-background-color);
        --mat-table-header-headline-color: var(--mat-text-color);
        --mat-table-row-item-label-text-color: var(--mat-text-color);
        --mat-table-row-item-outline-color: rgba(var(--mat-text-color), 0.12);

        /* size */
        --mat-table-row-item-outline-width: 1px;
        --mat-table-header-container-height: 56px;
        --mat-table-footer-container-height: 52px;
        --mat-table-row-item-container-height: 52px;

        /* typography */
        --mat-table-header-headline-font: var(--font-family);
        --mat-table-header-headline-line-height: var(--line-height-22);
        --mat-table-header-headline-size: var(--font-size-14);
        --mat-table-header-headline-weight: var(--font-weight-medium);
        --mat-table-header-headline-tracking: 0.0071428571em;
        --mat-table-row-item-label-text-font: var(--font-family);
        --mat-table-row-item-label-text-line-height: var(--line-height-20);
        --mat-table-row-item-label-text-size: var(--font-size-14);
        --mat-table-row-item-label-text-weight: var(--font-weight-regular);
        --mat-table-row-item-label-text-tracking: 0.0178571429em;
        --mat-table-footer-supporting-text-font: var(--font-family);
        --mat-table-footer-supporting-text-line-height: var(--line-height-20);
        --mat-table-footer-supporting-text-size: var(--font-size-14);
        --mat-table-footer-supporting-text-weight: var(--font-weight-regular);
        --mat-table-footer-supporting-text-tracking: 0.0178571429em;
    }

    html {
        /* size */
        --mdc-tab-indicator-active-indicator-height: 2px;
        --mdc-secondary-navigation-tab-container-height: 48px;

        /* border-radius */
        --mdc-tab-indicator-active-indicator-shape: 0;

        /* divider */
        --mat-tab-header-divider-color: var(--mat-transparent-color);
        --mat-tab-header-divider-height: 0;
    }

    .mat-mdc-tab-group,
    .mat-mdc-tab-nav-bar {
        /* default/primary color */
        --mdc-tab-indicator-active-indicator-color: var(--theme-primary-color);
        --mat-tab-header-disabled-ripple-color: rgba(var(--mat-text-color), 0.5);
        --mat-tab-header-pagination-icon-color: var(--mat-text-color);
        --mat-tab-header-inactive-label-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-tab-header-active-label-text-color: var(--theme-primary-color);
        --mat-tab-header-active-ripple-color: var(--theme-primary-color);
        --mat-tab-header-inactive-ripple-color: var(--theme-primary-color);
        --mat-tab-header-inactive-focus-label-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-tab-header-inactive-hover-label-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-tab-header-active-focus-label-text-color: var(--theme-primary-color);
        --mat-tab-header-active-hover-label-text-color: var(--theme-primary-color);
        --mat-tab-header-active-focus-indicator-color: var(--theme-primary-color);
        --mat-tab-header-active-hover-indicator-color: var(--theme-primary-color);
    }

    .mat-mdc-tab-group.mat-accent,
    .mat-mdc-tab-nav-bar.mat-accent {
        /* accent color */
        --mdc-tab-indicator-active-indicator-color: var(--theme-accent-color);
        --mat-tab-header-disabled-ripple-color: rgba(var(--mat-text-color), 0.5);
        --mat-tab-header-pagination-icon-color: var(--mat-text-color);
        --mat-tab-header-inactive-label-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-tab-header-active-label-text-color: var(--theme-accent-color);
        --mat-tab-header-active-ripple-color: var(--theme-accent-color);
        --mat-tab-header-inactive-ripple-color: var(--theme-accent-color);
        --mat-tab-header-inactive-focus-label-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-tab-header-inactive-hover-label-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-tab-header-active-focus-label-text-color: var(--theme-accent-color);
        --mat-tab-header-active-hover-label-text-color: var(--theme-accent-color);
        --mat-tab-header-active-focus-indicator-color: var(--theme-accent-color);
        --mat-tab-header-active-hover-indicator-color: var(--theme-accent-color);
    }

    .mat-mdc-tab-group.mat-warn,
    .mat-mdc-tab-nav-bar.mat-warn {
        /* warn color */
        --mdc-tab-indicator-active-indicator-color: var(--theme-warn-color);
        --mat-tab-header-disabled-ripple-color: rgba(var(--mat-text-color), 0.5);
        --mat-tab-header-pagination-icon-color: var(--mat-text-color);
        --mat-tab-header-inactive-label-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-tab-header-active-label-text-color: var(--theme-warn-color);
        --mat-tab-header-active-ripple-color: var(--theme-warn-color);
        --mat-tab-header-inactive-ripple-color: var(--theme-warn-color);
        --mat-tab-header-inactive-focus-label-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-tab-header-inactive-hover-label-text-color: rgba(var(--mat-text-color), 0.6);
        --mat-tab-header-active-focus-label-text-color: var(--theme-warn-color);
        --mat-tab-header-active-hover-label-text-color: var(--theme-warn-color);
        --mat-tab-header-active-focus-indicator-color: var(--theme-warn-color);
        --mat-tab-header-active-hover-indicator-color: var(--theme-warn-color);
    }

    .mat-mdc-tab-group.mat-background-primary,
    .mat-mdc-tab-nav-bar.mat-background-primary {
        --mat-tab-header-with-background-background-color: var(--theme-primary-color);
        --mat-tab-header-with-background-foreground-color: var(--mat-background-color);
    }

    .mat-mdc-tab-group.mat-background-accent,
    .mat-mdc-tab-nav-bar.mat-background-accent {
        --mat-tab-header-with-background-background-color: var(--theme-accent-color);
        --mat-tab-header-with-background-foreground-color: var(--mat-background-color);
    }

    .mat-mdc-tab-group.mat-background-warn,
    .mat-mdc-tab-nav-bar.mat-background-warn {
        --mat-tab-header-with-background-background-color: var(--theme-warn-color);
        --mat-tab-header-with-background-foreground-color: var(--mat-background-color);
    }

    html {
        /* toolbar */
        --mat-toolbar-container-background-color: var(--mat-background-color);
        --mat-toolbar-container-text-color: var(--mat-text-color);

        /* typography */
        --mat-toolbar-title-text-font: var(--font-family);
        --mat-toolbar-title-text-line-height: var(--line-height-32);
        --mat-toolbar-title-text-size: var(--font-size-20);
        --mat-toolbar-title-text-tracking: 0.0125em;
        --mat-toolbar-title-text-weight: var(--font-weight-medium);
    }

    .mat-mdc-tab-header {
        /* size */
        --mdc-secondary-navigation-tab-container-height: 48px;

        /* typography */
        --mat-tab-header-label-text-font: var(--font-family);
        --mat-tab-header-label-text-size: var(--font-size-14);
        --mat-tab-header-label-text-tracking: 0.0892857143em;
        --mat-tab-header-label-text-line-height: 36px;
        --mat-tab-header-label-text-weight: var(--font-weight-medium);
    }

    html {
        /* tooltip */
        --mdc-plain-tooltip-container-color: var(--mat-background-color);
        --mdc-plain-tooltip-supporting-text-color: var(--mat-text-color);

        /* typography */
        --mdc-plain-tooltip-supporting-text-font: var(--font-family);
        --mdc-plain-tooltip-supporting-text-size: var(--font-size-10);
        --mdc-plain-tooltip-supporting-text-weight: var(--font-weight-medium);
        --mdc-plain-tooltip-supporting-text-tracking: 0;
        --mdc-plain-tooltip-supporting-text-line-height: var(--line-height-16);

        /* size */
        --mat-toolbar-standard-height: 64px;
        --mat-toolbar-mobile-height: 56px;
    }

    .mat-toolbar.mat-primary {
        /* primary color */
        --mat-toolbar-container-background-color: var(--theme-primary-color);
        --mat-toolbar-container-text-color: var(--mat-background-color);
    }

    .mat-toolbar.mat-accent {
        /* accent color */
        --mat-toolbar-container-background-color: var(--theme-accent-color);
        --mat-toolbar-container-text-color: var(--mat-background-color);
    }

    .mat-toolbar.mat-warn {
        /* warn color */
        --mat-toolbar-container-background-color: var(--theme-warn-color);
        --mat-toolbar-container-text-color: var(--mat-background-color);
    }

    html {
        /* border-radius */
        --mdc-plain-tooltip-container-shape: var(--border-radius-4);

        /* color */
        --mdc-plain-tooltip-container-color: var(--mat-background-color);
        --mdc-plain-tooltip-supporting-text-color: var(--mat-text-color);

        /* typography */
        --mdc-plain-tooltip-supporting-text-line-height: var(--line-height-16);
        --mdc-plain-tooltip-supporting-text-font: var(--font-family);
        --mdc-plain-tooltip-supporting-text-size: var(--font-size-12);
        --mdc-plain-tooltip-supporting-text-weight: var(--font-weight-regular);
        --mdc-plain-tooltip-supporting-text-tracking: 0.0333333333em;
    }

    html {
        /* tree */
        --mat-tree-container-background-color: var(--mat-background-color);
        --mat-tree-node-text-color: var(--mat-text-color);

        /* size */
        --mat-tree-node-min-height: 48px;

        /* typography */
        --mat-tree-node-text-font: var(--font-family);
        --mat-tree-node-text-size: var(--font-size-14);
        --mat-tree-node-text-weight: var(--font-weight-regular);
    }
`;
