import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchPage } from './search.page';
import { SearchPageRoutingModule } from './search-routing.module';
import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SearchPageRoutingModule, MaterialModule],
  declarations: [SearchPage]
})
export class SearchPageModule {}
