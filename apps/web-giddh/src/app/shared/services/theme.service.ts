import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'default-theme' | 'dark-theme' | 'color-scheme-theme';

/**
 * Service for managing application themes and dynamic colors
 * @public
 */
@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    /** Current active theme */
    private currentTheme: string = 'default-theme';
    
    /** Current primary color */
    private currentPrimaryColor: string = '#1a237e';
    
    /** Theme change subject for reactive updates */
    private themeSubject = new BehaviorSubject<string>(this.currentTheme);
    
    /** Primary color change subject for reactive updates */
    private colorSubject = new BehaviorSubject<string>(this.currentPrimaryColor);
    
    /** Observable for theme changes */
    public theme$ = this.themeSubject.asObservable();
    
    /** Observable for primary color changes */
    public primaryColor$ = this.colorSubject.asObservable();

    constructor() {
        // Initialize theme from localStorage or default
        const savedTheme = localStorage.getItem('app-theme') || 'default-theme';
        const savedColor = localStorage.getItem('app-primary-color') || '#1a237e';
        this.setTheme(savedTheme);
        this.setPrimaryColor(savedColor);
    }

    /**
     * Set the application theme
     * @param {string} theme - Theme class name to apply
     * @public
     */
    public setTheme(theme: string): void {
        // Remove existing theme classes
        document.body.classList.remove('default-theme', 'dark-theme', 'color-scheme-theme');
        
        // Add new theme class
        document.body.classList.add(theme);
        
        // Update current theme
        this.currentTheme = theme;
        
        // Save to localStorage
        localStorage.setItem('app-theme', theme);
        
        // Emit theme change
        this.themeSubject.next(theme);
    }

    /**
     * Set the primary color dynamically
     * @param {string} hexColor - Hex color code (e.g., '#1a237e')
     * @public
     */
    public setPrimaryColor(hexColor: string): void {
        // Validate hex color format
        if (!/^#[0-9A-F]{6}$/i.test(hexColor)) {
            console.warn('Invalid hex color format. Expected format: #RRGGBB');
            return;
        }
        
        // Generate color palette from base color
        const palette = this.generateColorPalette(hexColor);
        
        // Apply CSS variables to root
        const root = document.documentElement;
        Object.entries(palette).forEach(([shade, color]) => {
            root.style.setProperty(`--primary-${shade}`, color);
        });
        
        // Update current color
        this.currentPrimaryColor = hexColor;
        
        // Save to localStorage
        localStorage.setItem('app-primary-color', hexColor);
        
        // Emit color change
        this.colorSubject.next(hexColor);
    }

    /**
     * Generate color palette from base hex color
     * @param {string} baseColor - Base hex color
     * @return {Object} Color palette object
     * @private
     */
    private generateColorPalette(baseColor: string): { [key: string]: string } {
        // Convert hex to RGB
        const hex = baseColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Helper function to lighten/darken color
        const adjustColor = (r: number, g: number, b: number, percent: number): string => {
            const factor = percent > 0 ? (255 - Math.max(r, g, b)) * (percent / 100) : Math.max(r, g, b) * (percent / 100);
            const newR = Math.round(Math.max(0, Math.min(255, r + factor)));
            const newG = Math.round(Math.max(0, Math.min(255, g + factor)));
            const newB = Math.round(Math.max(0, Math.min(255, b + factor)));
            return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        };
        
        return {
            '50': adjustColor(r, g, b, 45),
            '100': adjustColor(r, g, b, 35),
            '200': adjustColor(r, g, b, 25),
            '300': adjustColor(r, g, b, 15),
            '400': adjustColor(r, g, b, 10),
            '500': adjustColor(r, g, b, 5),
            '600': baseColor,
            '700': adjustColor(r, g, b, -5),
            '800': adjustColor(r, g, b, -10),
            '900': adjustColor(r, g, b, -15),
            'A100': adjustColor(r, g, b, 30),
            'A200': adjustColor(r, g, b, 20),
            'A400': adjustColor(r, g, b, 10),
            'A700': baseColor
        };
    }

    /**
     * Get the current active theme
     * @return {string} Current theme class name
     * @public
     */
    public getCurrentTheme(): string {
        return this.currentTheme;
    }

    /**
     * Get the current primary color
     * @return {string} Current primary color hex code
     * @public
     */
    public getCurrentPrimaryColor(): string {
        return this.currentPrimaryColor;
    }

    /**
     * Toggle between light and dark themes
     * @public
     */
    public toggleTheme(): void {
        const newTheme = this.currentTheme === 'default-theme' ? 'dark-theme' : 'default-theme';
        this.setTheme(newTheme);
    }

    /**
     * Check if current theme is dark
     * @return {boolean} True if dark theme is active
     * @public
     */
    public isDarkTheme(): boolean {
        return this.currentTheme === 'dark-theme';
    }

    /**
     * Checks if current theme is light
     * @public
     * @returns {boolean} True if light theme is active
     * @memberof ThemeService
     */
    public isLightTheme(): boolean {
        return this.getCurrentTheme() === 'default-theme';
    }

    /**
     * Checks if system color scheme theme is active
     * @public
     * @returns {boolean} True if color-scheme theme is active
     * @memberof ThemeService
     */
    public isSystemTheme(): boolean {
        return this.getCurrentTheme() === 'color-scheme-theme';
    }
}
