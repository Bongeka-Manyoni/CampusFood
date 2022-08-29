import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { ToastController } from '@ionic/angular';
import { Customer } from 'src/app/interfaces/customers';
import { Payment } from 'src/app/interfaces/payment';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  userEmail: any;
  loggedUser:any=[];
  
  cust = {} as Customer;
  payment = {} as Payment;

  constructor(private auth:AngularFireAuth,
     private router:Router,
     private toast:ToastController,
     private fstore:AngularFirestore
     ) { }

  ngOnInit() {
    this.userDetails();
    StatusBar.setBackgroundColor({color: '#ffcc00'});
    StatusBar.setOverlaysWebView({overlay: false});
  }

  //get user personal details from firestore database
  userDetails(){
    this.userEmail = JSON.parse(localStorage.getItem("email"));
    this.fstore.collection('RegisteredUsers').doc(this.userEmail).get().subscribe((data) => {
      this.loggedUser = data.data();
    })
  }

  showToast(message:string){
    this.toast.create({message:message, duration: 6000, position: "top", color: "dark"}).then(toastData=> toastData.present())
  }

  //log out of the application
  logOut(){
    this.auth.signOut()
    .then(() => {
      localStorage.removeItem("email");
      this.router.navigate(['main-page/login']);
    })
  }

}
