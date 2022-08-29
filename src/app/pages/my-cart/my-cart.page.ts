import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { ToastController } from '@ionic/angular';
import { Food } from 'src/app/interfaces/food';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.page.html',
  styleUrls: ['./my-cart.page.scss'],
})
export class MyCartPage implements OnInit {

  constructor(
    private fstore:AngularFirestore, private toast:ToastController,
    private location:Location, private route:Router,
  ) { }

  cartItems:any=[];
  cartLength:any;
  userEmail:any;
  totalAmount = 0;
  price: any;
  quantity: any;

  ngOnInit() {
    this.userEmail = JSON.parse(localStorage.getItem("email"));
    this.getCartItems();
    StatusBar.setBackgroundColor({color: '#ffcc00'});
    StatusBar.setOverlaysWebView({overlay: false});
  }

  showToast(message:string){
    this.toast.create({message:message, duration: 2000, position: 'top'})
    .then(toastData => toastData.present());
  }

  //retrieves all the cart items belonging to the current user
  getCartItems(){
    this.fstore.collection<any>("Cart", ref => ref.where('userId', '==', this.userEmail)).valueChanges().subscribe((cart) => {
      this.cartItems = cart;
      this.cartLength = this.cartItems.length;
      console.log(this.cartItems);
    });
  }

  //removes the cart item from the cart
  deleteItem(cartId){
    this.fstore.collection("Cart").doc(cartId).delete()
    .then(() => {
      this.showToast("Item has been deleted from cart");
    })
    .catch((error) => {
      this.showToast(error.mesage);
    })
  }

  //navigates to the previous page
  goBack(){
    this.location.back();
  }

  //increaments the quantity of an item
  increaseQty(cartId){
    var item = [];
    this.fstore.collection("Cart").doc(cartId).get().subscribe((res)=>{
      item.push(res.data());

      for(let x of item){
        this.quantity = x.quantity + 1;
        this.price = x.foodPrice + (x.foodPrice / x.quantity);
        break;
      }
      this.fstore.collection("Cart").doc(cartId).update({
        quantity: this.quantity,
        foodPrice: this.price
      })
    })
  }

  //decrements the quantity 
  decreaseQty(cartId){
    var item = [];
    this.fstore.collection("Cart").doc(cartId).get().subscribe((res)=>{
      item.push(res.data());

      for(let x of item){
        if(x.quantity > 1){
          this.quantity = x.quantity - 1;
          this.price = x.foodPrice - (x.foodPrice / x.quantity);
        }
        break;
      }
      this.fstore.collection("Cart").doc(cartId).update({
        quantity: this.quantity,
        foodPrice: this.price
      })
    })
  }

  checkout(){
    if(this.cartLength == 0){
      this.showToast("Please fill your cart before attempting to checkout");
    }
    else{
      this.route.navigate(['checkout']);
    }
  }
}
