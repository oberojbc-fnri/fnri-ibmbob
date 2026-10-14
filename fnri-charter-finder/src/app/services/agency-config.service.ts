import { Injectable } from '@angular/core';
import agencyConfig from '../data/agency.config.json';

export interface AgencyConfig {
  agencyName: string;
  fullName: string;
  tagline: string;
  department: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contact: {
    email: string;
    phone: string;
    website: string;
    address: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AgencyConfigService {
  readonly config: AgencyConfig = agencyConfig as unknown as AgencyConfig;

  applyTheme(): void {
    const root = document.documentElement;
    root.style.setProperty('--ion-color-primary', this.config.primaryColor);
    root.style.setProperty('--ion-color-secondary', this.config.secondaryColor);
    root.style.setProperty('--ion-color-tertiary', this.config.accentColor);
  }
}
