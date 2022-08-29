import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ComponentsModule } from './components/components.module';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    ComponentsModule,
    AngularFirestoreModule,
    HttpClientModule,
    Ng2SearchPipeModule
  ],
  providers: [EmailComposer,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
