import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { UploadPageRoutingModule } from './upload-routing.module';
import { UploadPage } from './upload.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, UploadPageRoutingModule],
  declarations: [UploadPage],
})
export class UploadPageModule {}
