import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SplashPagePageRoutingModule } from './splash-page-routing.module';

import { SplashPagePage } from './splash-page.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplashPagePageRoutingModule,
    ComponentsModule
  ],
  declarations: [SplashPagePage]
})
export class SplashPagePageModule {}
