import { InjectionToken } from '@angular/core';

export interface IServiceConfigArgs {
    appUrl: string;
    apiUrl: string;
    _: any;
}

export const ServiceConfig = new InjectionToken('ServiceConfig');
