import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MealPreviewPage } from './meal-preview.page';

const routes: Routes = [
  {
    path: '',
    component: MealPreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MealPreviewPageRoutingModule {}
