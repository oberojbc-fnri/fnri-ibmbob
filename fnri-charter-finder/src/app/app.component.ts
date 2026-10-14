import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, IsActiveMatchOptions } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AgencyConfigService } from './services/agency-config.service';
import { AgencyContextService } from './services/agency-context.service';
import { AgencyMeta, AGENCIES } from './data/agencies/index';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  /** true when viewport ≥ 960 px */
  isDesktop$ = this.bp
    .observe(['(min-width: 960px)'])
    .pipe(map(s => s.matches));

  /** Drives the .sidenav-collapsed class on the shell */
  sidenavCollapsed = false;

  /** Reactive agency context for the template */
  activeAgency: AgencyMeta | null = null;
  readonly agencies: AgencyMeta[] = AGENCIES;

  private subs: Subscription[] = [];

  constructor(
    private agencyConfig: AgencyConfigService,
    private bp: BreakpointObserver,
    private agencyContext: AgencyContextService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.agencyConfig.applyTheme();

    // Keep logo/label in sync with agency context
    this.subs.push(
      this.agencyContext.agencyId$.subscribe(() => {
        this.activeAgency = this.agencyContext.agency;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  toggleSidenav(): void {
    this.sidenavCollapsed = !this.sidenavCollapsed;
  }

  /** Navigate to a main section */
  navigateTo(path: '/search' | '/browse' | '/wizard'): void {
    this.router.navigate([path]);
  }

  /** Go to All Agencies landing page and clear agency context */
  goToAllAgencies(): void {
    this.agencyContext.clear();
    this.router.navigate(['/landing']);
  }

  /** Select a specific agency and navigate to search */
  goToAgency(agency: AgencyMeta): void {
    this.agencyContext.setAgency(agency.id);
    this.router.navigate(['/search']);
  }

  /** Check if the current route starts with the given path */
  isRoute(path: string): boolean {
    return this.router.isActive(path, {
      paths: 'subset', queryParams: 'ignored',
      fragment: 'ignored', matrixParams: 'ignored',
    } as IsActiveMatchOptions);
  }
}
