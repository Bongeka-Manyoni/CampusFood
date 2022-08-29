import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { StatusBar } from '@capacitor/status-bar';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-meal-preview',
  templateUrl: './meal-preview.page.html',
  styleUrls: ['./meal-preview.page.scss'],
})
export class MealPreviewPage implements OnInit {

  constructor(
    private fstore: AngularFirestore,
    private location:Location,
    private toast:ToastController
  ) { }

  item:any = [];
  quantity = 1;
  totalAmount = 0;
  price:any;
  cartId:any;
  userEmail: any;

  ngOnInit() {
    this.userEmail = JSON.parse(localStorage.getItem("email"));
    this.item = JSON.parse(localStorage.getItem("meal"));
    this.price = this.item.menu_price;
    this.totalAmount = Math.round(parseFloat(this.price));
    
    StatusBar.setBackgroundColor({color: '#ffcc00'});
    StatusBar.setOverlaysWebView({overlay: false});
  }

  increaseQty(){
    this.quantity++;
    return this.totalAmount += Math.round(parseFloat(this.price));
    //return this.total.toFixed(2);
  }

  decreaseQty(){
    if(this.quantity == 1){
      this.quantity = 1;
      return this.totalAmount = Math.round(parseFloat(this.price));
    }

    if(this.quantity > 1){
      this.quantity--;
      return this.totalAmount -= Math.round(parseFloat(this.price));
      //return this.total.toFixed(2);
    }
  }

  goBack(){
    this.location.back();
  }

  //adds item to cart
  addCart(image, foodName, prepTime){
      this.generateCartId();
      let cartItems = {
        cartId: this.cartId,
        userId: this.userEmail,
        foodImage: image,
        foodName: foodName,
        foodPrice: this.totalAmount,
        quantity: this.quantity,
        prepTime: prepTime,
        
      }
      this.fstore.collection("Cart").doc(this.cartId).set(cartItems)
      .then(() => {
        this.showToast("Added to cart");
        this.goBack();
      })
      .catch((error) => {
        this.showToast(error.message);
      })
    //}
  }

  showToast(message:string){
    this.toast.create({message:message, duration:2000, position: 'top'}).then(toastdata => toastdata.present());
  }

  //generates a unique cart id to be stored for each item added to cart by the user
  generateCartId(){
    let date = new Date();
    this.cartId = date.getFullYear().toString() + Math.round(date.getMilliseconds() + Math.random());
    return this.cartId; 
  }

}
