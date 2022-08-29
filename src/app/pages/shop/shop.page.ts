import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { AlertController, ToastController } from '@ionic/angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Food } from 'src/app/interfaces/food';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {

  constructor(
    private router:Router,private fstore: AngularFirestore,
    private toast:ToastController, private alert:AlertController
  ) { }

  cartId:any;
  loggedUser: any = [];
  userEmail: any;
  menu:any=[];
  slideshow: any = [];
  cartItems:any = [];
  cartLength = 0;
  orders: any = [];
  foodItems:any = [];
  prep_hour:any;
  prep_minutes:any;
  today = new Date();
  time:any; //order time
  search:string;
  
  getDetails(){
    this.userEmail = JSON.parse(localStorage.getItem("email"));
    this.getCartLength();
    this.fstore.collection("RegisteredUsers").doc(this.userEmail)
    .get().subscribe((doc) => {
      if(doc.exists){
          this.loggedUser = doc.data();
        }
      })
  }

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 4,
    spacebetween: 0,
    autoplay: true
  }

  ngOnInit() {
    this.getDetails();
    this.getCategory();
    this.getMenuItems();
    this.getOrders();

    StatusBar.setBackgroundColor({color: '#ffcc00'});
    StatusBar.setOverlaysWebView({overlay: false});
  }

  getMenuItems(){
    this.fstore.collection("MenuItems").valueChanges().subscribe((res) => {
      this.menu = res;
    });
  }

  viewMeal(meal:any){
    localStorage.setItem("meal", JSON.stringify(meal));
    this.router.navigate(['meal-preview']);
  }

  showToast(message:string){
    this.toast.create({message:message, duration:2000, position: 'top'}).then(toastdata => toastdata.present());
  }

  addCart(image, foodName, price, prepTime){
    this.getCartLength();
      this.generateCartId();
      let cartItems = {
        cartId: this.cartId,
        userId: this.userEmail,
        foodImage: image,
        foodName: foodName,
        foodPrice: price,
        quantity: 1,
        prepTime : prepTime
      }
      
      this.fstore.collection("Cart").doc(this.cartId).set(cartItems).then((data) => {
        this.showToast("Added to cart");
      })
      .catch((error) => {
        this.showToast(error.message);
      })
  }

  getCategory(){
    this.fstore.collection("MenuCategory").valueChanges().subscribe((res) => {
      this.slideshow = res;
    });
  }

  selectedCategory(catId:any){
    var temp = this.menu;
    if(this.menu.filter((cat) => cat.menu_cat_id == catId)){
      this.menu = temp.filter((cat) => cat.menu_cat_id == catId);
    }
  }

  generateCartId(){
    let date = new Date();
    this.cartId = date.getFullYear().toString() + Math.round(date.getMilliseconds() + Math.random());
    return this.cartId; 
  }

  getCartLength(){
    this.fstore.collection<any>("Cart", ref => ref.where('userId', '==', this.userEmail)).valueChanges().subscribe((cart) => {
      this.cartItems = cart;
      this.cartLength = this.cartItems.length;
    });
  }

  getOrders(){
    this.fstore.collection<any>("Orders", ref => ref.where('UserId', '==', this.userEmail)).valueChanges().subscribe(async (order) => {
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
      
          let audio = new Audio();
            audio.src = "./assets/audio/sound.wav";
            audio.load();
            audio.play();
          await message.present();
        }
        break;
      }
    })
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 1000);
  }
}
