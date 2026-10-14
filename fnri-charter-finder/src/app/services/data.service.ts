import { Injectable } from '@angular/core';
import * as servicesData from '../data/services.json';
import * as categoriesData from '../data/categories.json';
import * as wizardData from '../data/wizard.json';

export interface Service {
  id: string;
  plainName: string;
  officialName: string;
  description: string;
  category: string;
  office: string;
  whoMayAvail: string;
  requirements: string[];
  processingTime: string;
  fees: string;
  tags: string[];
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface WizardAnswer {
  label: string;
  tag: string;
}

export interface WizardQuestion {
  id: string;
  question: string;
  icon: string;
  answers: WizardAnswer[];
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private services: Service[] = servicesData as Service[];
  private categories: Category[] = categoriesData as Category[];
  private wizardQuestions: WizardQuestion[] = wizardData as WizardQuestion[];

  getServices(): Service[] {
    return this.services;
  }

  getServiceById(id: string): Service | undefined {
    return this.services.find(s => s.id === id);
  }

  getCategories(): Category[] {
    return this.categories;
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  getServicesByCategory(categoryId: string): Service[] {
    return this.services.filter(s => s.category === categoryId);
  }

  getWizardQuestions(): WizardQuestion[] {
    return this.wizardQuestions;
  }

  getServicesByTags(tags: string[]): Service[] {
    if (!tags.length) return this.services;
    return this.services.filter(s =>
      tags.some(tag => s.tags.includes(tag))
    );
  }

  getFreeServices(): Service[] {
    return this.services.filter(s => s.fees === 'Free');
  }
}
