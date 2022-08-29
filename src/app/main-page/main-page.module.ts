import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPagePageRoutingModule } from './main-page-routing.module';

import { MainPagePage } from './main-page.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MainPagePageRoutingModule
  ],
  declarations: [MainPagePage]
})
export class MainPagePageModule {}
