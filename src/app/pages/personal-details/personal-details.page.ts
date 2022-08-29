import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireStorage,AngularFireUploadTask} from '@angular/fire/compat/storage';
import { StatusBar } from '@capacitor/status-bar';
import { LoadingController, ToastController } from '@ionic/angular';
import { Customer } from 'src/app/interfaces/customers';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.page.html',
  styleUrls: ['./personal-details.page.scss'],
})
export class PersonalDetailsPage implements OnInit {

  cust = {} as Customer;
  userEmail:any;
  loggedUser:any=[];
  imagex:any;
  path:any;
  imageUpload: AngularFireUploadTask;

  constructor(
    private toast:ToastController, private location: Location,
    private fstore:AngularFirestore, private auth:AngularFireAuth,
    private route:Router, private storage:AngularFireStorage,
    private load:LoadingController
  ) { }

  ngOnInit() {
    this.getUserDetails();
    StatusBar.setBackgroundColor({color: '#ffcc00'});
    StatusBar.setOverlaysWebView({overlay: false});
  }

  getUserDetails(){
    this.userEmail = JSON.parse(localStorage.getItem("email"));
    this.fstore.collection("RegisteredUsers").doc(this.userEmail)
    .get().subscribe((doc) => {
      if(doc.exists){
        this.loggedUser = doc.data();
      }
    })
  }

  showToast(message:string){
    this.toast.create({message:message, duration: 6000, position: "top"}).then(toastData=> toastData.present())
  }

  /*checks if the contact number field has valid value before attempting 
   to save the changes*/
   async updateContact(){
    let loader = await this.load.create({
      message: 'Processing',
      spinner: 'circular',
    });

    let  contactValidator = new RegExp(/^((?:\+27|27)|0)(\d{2})-?(\d{3})-?(\d{4})$/);
    if(!contactValidator.test(this.cust.contact)){
      this.showToast("Invalid contact number");
    }
    else{
      loader.present();
      this.fstore.collection('RegisteredUsers').doc(this.userEmail).update({
        Contact: this.cust.contact
      }).then(() => {
        this.showToast("Your contact number has been updated successfully");
        loader.dismiss();
      })
      .catch((error) => {
        loader.dismiss();
        this.showToast(error.message);
      })
    }

    if(!this.cust.contact){
      this.showToast("Please enter your contact number");
    }
  }

  //navigates to the previous page
  goBack(): void{
    this.location.back();
  }

  logOut(){
    this.auth.signOut().then(() => {
      localStorage.removeItem("email");
      this.route.navigate(['main-page/login']);
    })
  }

  //uploads user image
  async upLoad(event){
    let load = this.load.create({
      message: "Uploading image",
      spinner: 'circular',
    });
    
    const file =event.target.files;
    console.log(file);
    var fileName=file[0];
    console.log(fileName);

    (await load).present();
    
    this.path=`profile-pictures/${fileName.name}`;
    
    var fileRef=this.storage.ref(this.path);
    this.imageUpload=this.storage.upload(this.path,fileName);
    this.imageUpload.then(res =>{
      var imageFile=res.task.snapshot.ref.getDownloadURL();
       imageFile.then(async downloadURL =>{
       this.imagex=downloadURL;
       this.fstore.collection("RegisteredUsers").doc(this.userEmail).update({
        userImage: this.imagex
       }).catch((error) => {
        this.showToast(error.message);
       })
        console.log(downloadURL);
        (await load).dismiss();
       } );   
    })
  }

}

