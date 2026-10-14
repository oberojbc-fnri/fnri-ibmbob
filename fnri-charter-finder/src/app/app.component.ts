import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AgencyConfigService } from './services/agency-config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  /** true when viewport is ≥ 960 px (Material Breakpoints.Medium = 960px) */
  isDesktop$ = this.bp
    .observe(['(min-width: 960px)'])
    .pipe(map(s => s.matches));

  constructor(
    private agencyConfig: AgencyConfigService,
    private bp: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    this.agencyConfig.applyTheme();
  }
}
