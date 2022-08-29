import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.page.html',
  styleUrls: ['./main-page.page.scss'],
})
export class MainPagePage implements OnInit {

  constructor() { }

  ngOnInit() {
    StatusBar.setBackgroundColor({color: '#ffcc00'});
    StatusBar.setOverlaysWebView({overlay: false});
  }

}
