import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule, TabsPageRoutingModule, MaterialModule],
  declarations: [TabsPage]
})
export class TabsPageModule {}
