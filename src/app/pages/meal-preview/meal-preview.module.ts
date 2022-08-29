import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MealPreviewPageRoutingModule } from './meal-preview-routing.module';

import { MealPreviewPage } from './meal-preview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MealPreviewPageRoutingModule
  ],
  declarations: [MealPreviewPage]
})
export class MealPreviewPageModule {}
