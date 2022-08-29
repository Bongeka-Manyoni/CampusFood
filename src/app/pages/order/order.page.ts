import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  orders: any = [];
  userEmail:any;
  foodItems:any = [];
  menu:any=[];
  prep_hour:any;
  prep_minutes:any;
  today = new Date();
  time:any;
  accepted = 0;
  prepTime = 0;
  constructor(
    private route:Router, private auth:AngularFireAuth,
    private location:Location, private fstore:AngularFirestore,
    private toast:ToastController, private alert:AlertController
  ) { 
  }

  ngOnInit() {
    this.userEmail = JSON.parse(localStorage.getItem("email"));
    this.prep_hour = this.today.getHours();
    this.prep_minutes = this.today.getMinutes();
    this.getOrders();

    this.fstore.collection("Orders", ref => ref.where('DeliveryMethod','==','Delivery')).valueChanges().subscribe((res) =>{
      var order:any = res;
      for(let x of order){
        if(x.Status == 'Ready'){
          order = x;
        }
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

  //navigates to the previous page
  goBack(){
    this.location.back();
  }

  getOrders(){
    window.onfocus;
    this.fstore.collection<any>("Orders", ref => ref.where('UserId', '==', this.userEmail).where('Status','in',['Preparing','Ready','Accepted','Pending'])).valueChanges().subscribe(async (order) => {
      this.orders = order;
      this.time = this.prep_hour +":" +this.prep_minutes;
      for(let order of this.orders){
        this.foodItems = order.OrderItems;
        if(order.Status == "Ready"){
          const message= await this.alert.create({
            message: "Order " +order.OrderNumber +' is ready!',
            buttons: ['OK'],
            animated: true,
          });
      
          await message.present();
          let audio = new Audio();
            audio.src = "./assets/audio/sound.wav";
            audio.load();
            audio.play();
        }
        break;
      }
    })
  }

  showToast(message:string){
    this.toast.create({message:message, duration: 2500, position: 'top'}).then(toastData => toastData.present());
  }

  
  addToOrder(food){
    if(food.Status != "Pending"){
      this.showToast("Your order has already been processed");
      this.route.navigate(['home/order']);
    }
    else{
      localStorage.setItem("orderNumber", JSON.stringify(food));
    this.route.navigate(['add-order']);
    }
    
  }

  viewOrder(order){
    localStorage.setItem("order", JSON.stringify(order));
    this.route.navigate(['order-details']);
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 1000);
  }
}
