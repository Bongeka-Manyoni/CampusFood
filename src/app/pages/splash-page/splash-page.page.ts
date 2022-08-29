import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-splash-page',
  templateUrl: './splash-page.page.html',
  styleUrls: ['./splash-page.page.scss'],
})
export class SplashPagePage implements OnInit {

  constructor(private route:Router) { }

  ngOnInit() {

    StatusBar.setBackgroundColor({color: '#1e2023'});
    StatusBar.setOverlaysWebView({overlay: false});
    setTimeout(() => {
      this.route.navigate(['main-page/login']);
    }, 2000);
  }

}
