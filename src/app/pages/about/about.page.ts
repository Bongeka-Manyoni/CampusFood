import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { EmailComposerOptions } from '@awesome-cordova-plugins/email-composer';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(
    private location:Location, private composer: EmailComposer
  ) { }

  ngOnInit() {
    StatusBar.setBackgroundColor({color: '#ffcc00'});
    StatusBar.setOverlaysWebView({overlay: false});
  }

  goBack(){
    this.location.back();
  }

  async emailOpen(){
    const email :EmailComposerOptions= {
      app: 'gmail',
      to: 'theincredibles173@gmail.com',
    };
    await this.composer.open(email);
  }

}
