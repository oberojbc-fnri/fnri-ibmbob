// agencies/index.ts
// Merges all agency services at import time — no runtime fetch.
// Each service gets an `agencyId` field for cross-agency display.

import fnriServices   from './fnri/services.json';
import pnriServices   from './pnri/services.json';
import seiServices    from './sei/services.json';
import fnriConfig     from './fnri/agency.config.json';
import pnriConfig     from './pnri/agency.config.json';
import seiConfig      from './sei/agency.config.json';
import fnriCategories from './fnri/categories.json';
import pnriCategories from './pnri/categories.json';
import seiCategories  from './sei/categories.json';

export interface AgencyMeta {
  id: string;
  agencyName: string;
  agencyAbbreviation?: string;
  fullName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  contact: { email: string; phone: string; website: string; address: string };
  serviceCount: number;
}

export interface AgencyService {
  id: string;
  plainName: string;
  officialName?: string;
  description: string;
  category: string;
  office: string;
  whoMayAvail: string;
  requirements: string[];
  processingTime: string;
  fees: string;
  tags: string[];
  agencyId: string;
  agencyName: string;
  agencyColor: string;
}

function tag<T extends object>(items: T[], agencyId: string, agencyName: string, agencyColor: string): AgencyService[] {
  return (items as any[]).map(s => ({ ...s, agencyId, agencyName, agencyColor }));
}

export const AGENCIES: AgencyMeta[] = [
  {
    id: 'fnri',
    agencyName:         (fnriConfig as any).agencyName,
    agencyAbbreviation: 'FNRI',
    fullName:           (fnriConfig as any).fullName,
    tagline:            (fnriConfig as any).tagline,
    primaryColor:       (fnriConfig as any).primaryColor,
    secondaryColor:     (fnriConfig as any).secondaryColor,
    logo:               (fnriConfig as any).logo,
    contact:            (fnriConfig as any).contact,
    serviceCount:       fnriServices.length,
  },
  {
    id: 'pnri',
    agencyName:         (pnriConfig as any).agencyName,
    agencyAbbreviation: 'PNRI',
    fullName:           (pnriConfig as any).fullName,
    tagline:            (pnriConfig as any).tagline,
    primaryColor:       (pnriConfig as any).primaryColor,
    secondaryColor:     (pnriConfig as any).secondaryColor,
    logo:               (pnriConfig as any).logo ?? 'assets/logo.png',
    contact:            (pnriConfig as any).contact,
    serviceCount:       pnriServices.length,
  },
  {
    id: 'sei',
    agencyName:         (seiConfig as any).agencyName,
    agencyAbbreviation: 'SEI',
    fullName:           (seiConfig as any).fullName,
    tagline:            (seiConfig as any).tagline,
    primaryColor:       (seiConfig as any).primaryColor,
    secondaryColor:     (seiConfig as any).secondaryColor,
    logo:               (seiConfig as any).logo ?? 'assets/logo.png',
    contact:            (seiConfig as any).contact,
    serviceCount:       seiServices.length,
  },
];

export const ALL_AGENCY_SERVICES: AgencyService[] = [
  ...tag(fnriServices as any[], 'fnri', 'DOST-FNRI', (fnriConfig as any).primaryColor),
  ...tag(pnriServices as any[], 'pnri', 'DOST-PNRI', (pnriConfig as any).primaryColor),
  ...tag(seiServices  as any[], 'sei',  'DOST-SEI',  (seiConfig  as any).primaryColor),
];

export const CATEGORIES_BY_AGENCY: Record<string, any[]> = {
  fnri: fnriCategories,
  pnri: pnriCategories,
  sei:  seiCategories,
};
