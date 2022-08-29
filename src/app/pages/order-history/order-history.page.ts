import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit {
  
  orders: any = [];
  userEmail:any;
  foodItems:any = [];
  constructor(
    private route:Router, private auth:AngularFireAuth,
    private location:Location, private fstore:AngularFirestore,
    private toast:ToastController
  ) { }

  ngOnInit() {
    this.userEmail = JSON.parse(localStorage.getItem("email"));
    this.getOrders();

    StatusBar.setBackgroundColor({color: '#ffcc00'});
    StatusBar.setOverlaysWebView({overlay: false});
  }

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

  getOrders(){
    this.fstore.collection<any>("Orders", ref => ref.where('UserId', '==', this.userEmail)).valueChanges().subscribe((order) => {
      this.orders = order;
      for(let x of this.orders){
        this.foodItems = x.OrderItems;
      }
    })
  }

  viewOrder(order){
    localStorage.setItem("order", JSON.stringify(order));
    this.route.navigate(['view-order']);
  }

}
