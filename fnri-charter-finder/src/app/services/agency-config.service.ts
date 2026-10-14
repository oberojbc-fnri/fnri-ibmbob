import { Injectable } from '@angular/core';
import agencyConfig from '../data/agency.config.json';

export interface AgencyConfig {
  agencyName: string;
  agencyAbbreviation?: string;
  fullName: string;
  tagline: string;
  department: string;
  logo: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contactEmail?: string;
  contactPhone?: string;
  officeAddress?: string;
  websiteUrl?: string;
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

  get contactEmail(): string {
    return this.config.contactEmail ?? this.config.contact?.email ?? '';
  }

  get contactPhone(): string {
    return this.config.contactPhone ?? this.config.contact?.phone ?? '';
  }

  get websiteUrl(): string {
    return this.config.websiteUrl ?? this.config.contact?.website ?? '';
  }

  get officeAddress(): string {
    return this.config.officeAddress ?? this.config.contact?.address ?? '';
  }

  applyTheme(): void {
    const root = document.documentElement;
    root.style.setProperty('--ion-color-primary', this.config.primaryColor);
    root.style.setProperty('--ion-color-secondary', this.config.secondaryColor);
    root.style.setProperty('--ion-color-tertiary', this.config.accentColor);
  }
}
