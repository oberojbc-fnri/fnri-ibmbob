import { Injectable } from '@angular/core';
import Fuse from 'fuse.js';
import { DataService, Service } from './data.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private fuse!: Fuse<Service>;

  constructor(private dataService: DataService) {
    const services = this.dataService.getServices();
    this.fuse = new Fuse(services, {
      keys: [
        { name: 'plainName', weight: 0.4 },
        { name: 'description', weight: 0.25 },
        { name: 'tags', weight: 0.2 },
        { name: 'category', weight: 0.1 },
        { name: 'office', weight: 0.05 },
      ],
      threshold: 0.4,
      minMatchCharLength: 2,
      includeScore: true,
    });
  }

  search(query: string): Service[] {
    if (!query || query.trim().length < 2) return [];
    return this.fuse.search(query).map(r => r.item);
  }
}
