import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';
import { DataService, Service } from './data.service';

const FUSE_OPTIONS = {
  keys: [
    { name: 'plainName',   weight: 0.4 },
    { name: 'description', weight: 0.25 },
    { name: 'tags',        weight: 0.2 },
    { name: 'category',    weight: 0.1 },
    { name: 'office',      weight: 0.05 },
  ],
  threshold: 0.4,
  minMatchCharLength: 2,
  includeScore: true,
};

@Injectable({ providedIn: 'root' })
export class SearchService {
  /** Global Fuse index over all 50 services */
  private fuseAll!: Fuse<Service>;
  /** Per-agency Fuse indexes, built lazily on first use */
  private fuseByAgency = new Map<string, Fuse<Service>>();

  constructor(private dataService: DataService) {
    this.fuseAll = new Fuse(this.dataService.getServices(), FUSE_OPTIONS);
  }

  /**
   * Search services.
   * @param query   search string (min 2 chars)
   * @param agencyId  when provided, restricts results to that agency
   */
  search(query: string, agencyId?: string | null): Service[] {
    if (!query || query.trim().length < 2) return [];

    if (agencyId) {
      if (!this.fuseByAgency.has(agencyId)) {
        this.fuseByAgency.set(
          agencyId,
          new Fuse(this.dataService.getServicesForAgency(agencyId), FUSE_OPTIONS)
        );
      }
      return this.fuseByAgency.get(agencyId)!.search(query).map(r => r.item);
    }

    return this.fuseAll.search(query).map(r => r.item);
  }
}
