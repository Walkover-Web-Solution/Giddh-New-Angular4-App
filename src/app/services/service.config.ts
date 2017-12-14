import { InjectionToken } from '@angular/core';

export interface IServiceConfigArgs {
  appUrl: string;
  apiUrl: string;
}

export const ServiceConfig = new InjectionToken('ServiceConfig');
