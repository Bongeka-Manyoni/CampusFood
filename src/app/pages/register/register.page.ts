import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Customer } from 'src/app/interfaces/customers';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  cust = {} as Customer;
  constructor(
    private auth: AngularFireAuth, private toast:ToastController, 
    private router:Router, private fstore:AngularFirestore, private load:LoadingController
  ) { }

ngOnInit() {
}

showToast(message:string){
  this.toast.create({message:message, duration:6000, position:"top"}).then(toastData => toastData.present());
}

validate(){
  let  contactValidator = new RegExp(/^((?:\+27|27)|0)(\d{2})-?(\d{3})-?(\d{4})$/);
  let  passwordValidator = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$');
  if(!this.cust.contact && !this.cust.email && !this.cust.name && !this.cust.password && !this.cust.surname){
    this.showToast("Please fill in all the fields below");
    return false;
  }
  
  if(!this.cust.name){
    this.showToast("Enter your name");
    return false;
  }

  if(!this.cust.surname){
    this.showToast("Enter your surname");
    return false;
  }

  if(!this.cust.email){
    this.showToast("Enter your email address");
    return false;
  }

  if(!this.cust.contact){
    this.showToast("Enter your contact number");
    return false;
  }

  if(!this.cust.password){
    this.showToast("Create password");
    return false;
  }

  if(!contactValidator.test(this.cust.contact)){
    this.showToast("Invalid contact number");
    return false;
  }

  if(this.cust.password.length < 6){
    this.showToast("Password must have a minimum of 6 characters");
    return false;
  }

  if(!passwordValidator.test(this.cust.password)){
    this.showToast("Password must contain atleast 1 uppercase, 1 lowercase, special character, and a digit");
    return false;
  }
  return true;
}

  async register(){
  let loader = await this.load.create({
    message: 'Processing',
    spinner: 'circular',
  });

  if(this.validate()){
    loader.present();
    let userData = {
      Name: this.cust.name,
      Surname: this.cust.surname,
      Email: this.cust.email,
      Contact: this.cust.contact
    }
    console.log(userData);
      
     this.auth.createUserWithEmailAndPassword(this.cust.email, this.cust.password)
      .then(async (User) => {
        (await this.auth.currentUser).sendEmailVerification()
          .then(() => {
            this.fstore.collection("RegisteredUsers").doc(this.cust.email).set(userData)
            .then(() => {

            })
            .catch((errorMsg) => {
              this.showToast(errorMsg.message);
            })
            this.showToast("An email verification link has been sent\nCheck your spam/junk folder");
            this.router.navigate(['login']);
            loader.dismiss();
          })
        
      })
      .catch((error) => {
        loader.dismiss();
        this.showToast(error.message);

      })
   }
}
}
