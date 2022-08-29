import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { ToastController, LoadingController } from '@ionic/angular';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {

  orderDetails:any=[];
  constructor(
    private route:Router, private auth:AngularFireAuth,
    private location:Location, private fstore:AngularFirestore,
    private toast:ToastController, private load:LoadingController
  ) { }

  ngOnInit() {
    this.orderDetails = JSON.parse(localStorage.getItem("order"));
    StatusBar.setBackgroundColor({color: '#ffcc00'});
    StatusBar.setOverlaysWebView({overlay: false});
  }

  slideOpts = {
    slidesPerView: 2,
    autoPlay: true,
    slideShadows: true,
    speed: 400,
    initialSlide: 0,
    spaceBetween: 3,
  };

  logOut(){
    this.auth.signOut()
    .then(() => {
      localStorage.removeItem("email");
      this.route.navigate(['main-page/login']);
    })
  }

  //navigates to the previous page
  goBack(){
    this.location.back();
  }

}
