import { Component, OnInit } from '@angular/core';
import { AgencyConfigService } from './services/agency-config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private agencyConfig: AgencyConfigService) {}

  ngOnInit(): void {
    this.agencyConfig.applyTheme();
  }
}
