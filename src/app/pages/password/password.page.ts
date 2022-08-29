import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';
import { Customer } from 'src/app/interfaces/customers';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {

  cust = {} as Customer;

  constructor(
    private toast:ToastController,
    private auth:AngularFireAuth,
    private location:Location
  ) { }

  ngOnInit() {
  }


  showToast(message:string){
    this.toast.create({message:message, duration:6000, position:"top", color: "dark"}).then(toastData => toastData.present());
  }

  emailValidation(){
    if(!this.cust.email){
      this.showToast("Please enter your email address");
      return false;
    }

    return true;
  }

  sendLink(){
    if(this.emailValidation()){
      if(this.auth.currentUser){
        this.auth.sendPasswordResetEmail(this.cust.email)
        .then(() => {
          this.showToast("Reset password link has been sent to your email");
          this.goBack();
        })
        .catch((error => {
          this.showToast(error.message);
        }))
      }
    }
  }

  //navigates to the previous page
  goBack(): void{
    this.location.back();
  }

}
