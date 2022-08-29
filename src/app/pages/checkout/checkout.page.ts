import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Delivery } from 'src/app/interfaces/delivery';
import { Payment } from 'src/app/interfaces/payment'
import { serverTimestamp } from 'firebase/firestore';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  loggedUser:any=[];
  collect = {} as Delivery;
  pay = {} as Payment;
  userEmail:any;
  cartItems: any = [];
  totalAmount = 0.00;
  subTotal = 0.00;
  deliveryAmount = 0.00;
  orderNumber: any;
  date = new Date();
  prepTime = 0;

  constructor(
    private route:Router, private auth:AngularFireAuth,
    private toast:ToastController, private load:LoadingController,
    private location:Location, private fstore:AngularFirestore
  ) { }

  ngOnInit() {
    this.userEmail = JSON.parse(localStorage.getItem("email"));
    this.getCartItems();
  }

  //retrieves items of the cart for the current user
  getCartItems(){
    this.fstore.collection("Cart", ref => ref.where('userId', '==', this.userEmail)).valueChanges().subscribe((cart) => {
      this.cartItems = cart;

      for(let item of this.cartItems){
        this.subTotal += Math.round(item.foodPrice);
      }
    })
  }

  logOut(){
    this.auth.signOut()
    .then(() => {
      localStorage.removeItem("email");
      this.route.navigate(['main-page/login']);
    })
  }

  getUserInfo(){
    this.fstore.collection("RegisteredUsers").doc(this.userEmail).get().subscribe((data) => {
      this.loggedUser = data;
    })
  }

  //navigates to the previous page
  goBack(){
    this.location.back();
  }

  deliveryOption(event){
    this.collect.method = event.detail.value;
    if(this.collect.method == "Delivery"){
      this.deliveryAmount = 10;
    }
    else if(this.collect.method == "Pick-up"){
      this.deliveryAmount = 0.00;
    }
    this.totalAmount = Math.round((this.subTotal + this.deliveryAmount));
  }

  paymentMethod(event){
    this.pay.method = event.detail.value;
  }

  async confirmOrder(){
    if(this.validation()){
      if(this.collect.method == "Delivery"){
        if(!this.collect.location){
          this.showToast("Please select the location in which yor order will be delivered to.");
          return false;
        }
        else if(this.collect.location == "Select delivery location"){
          this.showToast("Click on the delivery option and select the location in which yor order will be delivered to.");
          return false;
        }
        else{
          this.placeOrder();
          return true;
        }
      }
      else if(this.collect.method == "Pick-up"){
        this.collect.location = "In-store";
        this.placeOrder();
      }
    }
  }

  async placeOrder(){
    let loader = await this.load.create({
      message: 'Processing',
      spinner: 'circular',
    });
    
    this.generateOrderId();
    var orderItems = [];
      for(let x of this.cartItems){
        this.prepTime += parseInt(x.prepTime.substring(0, x.prepTime.indexOf(" ")));
        var item = {
          foodName: x.foodName + " x" + x.quantity,
          foodImage: x.foodImage
        }
        orderItems.push(item);
      }

      loader.present();
      let order = {
        OrderNumber: this.orderNumber,
        OrderItems: orderItems,
        TotalAmount: this.totalAmount,
        DeliveryMethod: this.collect.method,
        PaymentMethod: this.pay.method,
        deliveryLocation: this.collect.location,
        Date: this.date.toDateString().substring(4, 15),
        Time: this.date.toTimeString().substring(0, 8),
        Status: "Pending", 
        UserId: this.userEmail,
        userImage: " ",
        prepTime: this.prepTime + " minutes",
        orderTime: ""
      }
      this.fstore.collection("Orders").doc(this.orderNumber).set(order)
      .then(() => {
        loader.dismiss();
        this.showToast("Your order is being processed. Please proceed to the order's page to track your order status");
        for(let x of this.cartItems){
          this.fstore.collection("Cart").doc(x.cartId).delete()
          .catch((error) => {
            loader.dismiss();
            this.showToast(error.message);
          })
        }
        this.route.navigate(['home/order']);
      }).catch((error) => {
        loader.dismiss();
        this.showToast(error.message);
      })
  }

  //gets the delivery location
  getLocation(event){
    this.collect.location = event.detail.value;
  }

  validation(){
    if(!this.collect.method){
      this.showToast("Please specify your order collection preference");
      return false;
    }
    if(!this.pay.method){
      this.showToast("Please specify your payment method preference");
      return false;
    }
    return true;
  }

  showToast(message:string){
    this.toast.create({message:message, duration: 2000, position: 'top'}).then(toastData => toastData.present());
  }

  generateOrderId(){
    this.orderNumber = "#" + this.date.getFullYear().toString() + this.date.getMilliseconds();
  }
}
