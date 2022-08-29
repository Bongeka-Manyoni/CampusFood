import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Customer } from 'src/app/interfaces/customers';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  cust = {} as Customer;
  mail = false;
  errorMsg = "";
  
  constructor(private auth:AngularFireAuth, private route:Router,
     private toast:ToastController, private load:LoadingController,

  ) { }

  ngOnInit() {
  }

  showToast(message:string){
    this.toast.create({message:message, duration:4000, position:"top"}).then(toastData => toastData.present());
  }

  validate(){
    if(!this.cust.email && !this.cust.password){
      this.showToast("Enter your email address and password");
      return false;
    }
    if(!this.cust.password){
      this.showToast("Enter your email password");
      return false;
    }
    if(!this.cust.email){
      this.showToast("Enter your email address");
      return false;
    }
    return true;
  }

  
  async login(){
    let loader = this.load.create({
      message: 'Processing',
      spinner: 'circular',
    });

    if(this.validate()){
      (await loader).present();
      this.auth.signInWithEmailAndPassword(this.cust.email, this.cust.password)
        .then(async (user) => {
          const loggedin = this.auth.currentUser;
          if(loggedin){
            this.mail = (await loggedin).emailVerified;

            if(this.mail == true){
               localStorage.setItem('email', JSON.stringify(this.cust.email));
                this.route.navigate(['home/shop']);
                (await loader).dismiss();
                this.errorMsg = "";
                this.cust.password = "";
            }
            else{
              this.showToast("Your email has not been verified");
              (await loader).dismiss();
            }
          }
        })
        .catch(async (error) => {
          (await loader).dismiss();
          this.errorMsg = error.message;
        })
    }
  }
}

