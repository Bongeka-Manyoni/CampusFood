import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  orderDetails:any=[];
  constructor(
    private route:Router, private auth:AngularFireAuth,
    private location:Location, private fstore:AngularFirestore,
    private toast:ToastController, private load:LoadingController
  ) { }

  ngOnInit() {
    this.orderDetails = JSON.parse(localStorage.getItem("order"));
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

  async cancelOrder(){
    let loader = await this.load.create({
      message: 'Processing',
      spinner: 'circular',
    });

    if(this.orderDetails.Status != "Pending"){
      this.showToast("You cannot cancel the order once it has been accepted")
    }
    if(this.orderDetails.Status == "Pending"){
      loader.present();
      this.fstore.collection("Orders").doc(this.orderDetails.OrderNumber).update({
          Status: "Cancelled"
        })
        .then(() => {
          loader.dismiss();
            this.showToast("Order " +this.orderDetails.OrderNumber +" has been cancelled");
            this.route.navigate(['home/order']);
          }).catch((error) => {
            loader.dismiss();
        })
      }
    }

    showToast(message:string){
      this.toast.create({message:message, duration: 2500, position: 'top'}).then(toastData => toastData.present());
    }
}
