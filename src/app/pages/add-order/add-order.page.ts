import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion, increment } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.page.html',
  styleUrls: ['./add-order.page.scss'],
})
export class AddOrderPage implements OnInit {

  order:any;
  menu:any=[];
  quantity:any;
  price = 0;
  constructor(
    private route:Router, private auth:AngularFireAuth,
    private location:Location, private fstore:AngularFirestore,
    private toast:ToastController
  ) { }

  ngOnInit() {
    this.getMenuItems();
    this.quantity = 1;
    this.order = JSON.parse(localStorage.getItem("orderNumber"));
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

  getMenuItems(){
    this.fstore.collection('MenuItems').valueChanges().subscribe((item) => {
      this.menu = item;
    })
  } 

  @ViewChild('popover') popover;
  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  addOrder(image, price, name){
    var item = {
        foodName: name + " x" +this.quantity,
        foodImage: image
    }
    this.fstore.collection('Orders').doc(this.order.OrderNumber).update({
        OrderItems: arrayUnion(item),
        TotalAmount: increment(Math.round(price))
      }).then(() => {
        this.showToast("One item added to order " +this.order.OrderNumber);
        this.route.navigate(['home/order']);
      }).catch((error) => {
        this.showToast(error.message);
      })
  }

  showToast(message:string){
    this.toast.create({message:message, duration: 2000, position: 'top'}).then(toastData => toastData.present());
  }

}
