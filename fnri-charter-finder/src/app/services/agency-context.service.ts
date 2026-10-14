import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AGENCIES, AgencyMeta } from '../data/agencies/index';

@Injectable({ providedIn: 'root' })
export class AgencyContextService {
  /** null = all agencies (global mode); string = scoped to that agencyId */
  private _agencyId$ = new BehaviorSubject<string | null>(null);

  readonly agencyId$ = this._agencyId$.asObservable();

  get agencyId(): string | null {
    return this._agencyId$.value;
  }

  get agency(): AgencyMeta | null {
    const id = this._agencyId$.value;
    return id ? (AGENCIES.find(a => a.id === id) ?? null) : null;
  }

  setAgency(id: string | null): void {
    this._agencyId$.next(id);
  }

  clear(): void {
    this._agencyId$.next(null);
  }
}
