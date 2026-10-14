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
import fnriWizard     from './fnri/wizard.json';
import pnriWizard     from './pnri/wizard.json';
import seiWizard      from './sei/wizard.json';

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

export interface CategoryDef {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface WizardAnswerDef {
  label: string;
  tag: string;
}

export interface WizardQuestionDef {
  id: string;
  question: string;
  icon: string;
  answers: WizardAnswerDef[];
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

/** Merged, deduplicated category list across all agencies.
 *  Per-agency categories with the same id are merged — first definition wins for label/icon/color.
 *  Agency-specific categories (e.g. "information" for SEI) are appended. */
export const ALL_CATEGORIES: CategoryDef[] = (() => {
  const seen = new Set<string>();
  const result: CategoryDef[] = [];
  for (const cat of [...fnriCategories, ...pnriCategories, ...seiCategories] as CategoryDef[]) {
    if (!seen.has(cat.id)) {
      seen.add(cat.id);
      result.push(cat);
    }
  }
  return result;
})();

/** Merged wizard questions — union of all unique question IDs, answers deduplicated by tag. */
export const ALL_WIZARD_QUESTIONS: WizardQuestionDef[] = (() => {
  const allQs = [...fnriWizard, ...pnriWizard, ...seiWizard] as WizardQuestionDef[];
  const byId = new Map<string, WizardQuestionDef>();
  for (const q of allQs) {
    if (!byId.has(q.id)) {
      byId.set(q.id, { ...q, answers: [...q.answers] });
    } else {
      const existing = byId.get(q.id)!;
      const existingTags = new Set(existing.answers.map(a => a.tag));
      for (const a of q.answers) {
        if (!existingTags.has(a.tag)) {
          existing.answers.push(a);
          existingTags.add(a.tag);
        }
      }
    }
  }
  return [...byId.values()];
})();
