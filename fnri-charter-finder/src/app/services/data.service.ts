import { Injectable } from '@angular/core';
import {
  ALL_AGENCY_SERVICES,
  ALL_CATEGORIES,
  ALL_WIZARD_QUESTIONS,
  CATEGORIES_BY_AGENCY,
  AgencyService,
  CategoryDef,
  WizardQuestionDef,
} from '../data/agencies/index';

import fnriWizard from '../data/agencies/fnri/wizard.json';
import pnriWizard from '../data/agencies/pnri/wizard.json';
import seiWizard  from '../data/agencies/sei/wizard.json';

// Re-export as the canonical types consumed by page components
export type Service        = AgencyService;
export type Category       = CategoryDef;
export type WizardAnswer   = import('../data/agencies/index').WizardAnswerDef;
export type WizardQuestion = WizardQuestionDef;

const WIZARD_BY_AGENCY: Record<string, WizardQuestionDef[]> = {
  fnri: fnriWizard as unknown as WizardQuestionDef[],
  pnri: pnriWizard as unknown as WizardQuestionDef[],
  sei:  seiWizard  as unknown as WizardQuestionDef[],
};

@Injectable({ providedIn: 'root' })
export class DataService {
  private services: Service[]               = ALL_AGENCY_SERVICES;
  private categories: Category[]            = ALL_CATEGORIES;
  private wizardQuestions: WizardQuestion[] = ALL_WIZARD_QUESTIONS;

  // ── All-agency accessors ─────────────────────────────────────
  getServices(): Service[] { return this.services; }

  getServiceById(id: string): Service | undefined {
    return this.services.find(s => s.id === id);
  }

  getCategories(): Category[] { return this.categories; }

  getCategoryById(id: string): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  getServicesByCategory(categoryId: string): Service[] {
    return this.services.filter(s => s.category === categoryId);
  }

  getWizardQuestions(): WizardQuestion[] { return this.wizardQuestions; }

  getServicesByTags(tags: string[]): Service[] {
    if (!tags.length) return this.services;
    return this.services.filter(s => tags.some(tag => s.tags.includes(tag)));
  }

  getFreeServices(): Service[] {
    return this.services.filter(s => s.fees === 'Free');
  }

  // ── Agency-scoped accessors ──────────────────────────────────
  getServicesForAgency(agencyId: string): Service[] {
    return this.services.filter(s => s.agencyId === agencyId);
  }

  getCategoriesForAgency(agencyId: string): Category[] {
    const cats = (CATEGORIES_BY_AGENCY[agencyId] ?? []) as Category[];
    // Only return categories that actually have services for this agency
    const usedIds = new Set(this.getServicesForAgency(agencyId).map(s => s.category));
    return cats.filter(c => usedIds.has(c.id));
  }

  getServicesByCategoryForAgency(categoryId: string, agencyId: string): Service[] {
    return this.services.filter(s => s.category === categoryId && s.agencyId === agencyId);
  }

  getServiceCountForAgency(categoryId: string, agencyId: string): number {
    return this.getServicesByCategoryForAgency(categoryId, agencyId).length;
  }

  getWizardQuestionsForAgency(agencyId: string): WizardQuestion[] {
    return (WIZARD_BY_AGENCY[agencyId] ?? this.wizardQuestions) as WizardQuestion[];
  }

  getServicesByTagsForAgency(tags: string[], agencyId: string): Service[] {
    const pool = this.getServicesForAgency(agencyId);
    if (!tags.length) return pool;
    return pool.filter(s => tags.some(tag => s.tags.includes(tag)));
  }
}
