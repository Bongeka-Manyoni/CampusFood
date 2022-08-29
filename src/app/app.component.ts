import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { EmailComposerOptions } from '@awesome-cordova-plugins/email-composer';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private auth:AngularFireAuth, private router:Router,
    private fstore:AngularFirestore,  private composer:EmailComposer,
  ) {}

  loggedUser:any =[];
  userEmail:any;
  ngOnInit() {
    this.getDetails();
  }

  //get user personal details from firestore database
  getDetails(){
    this.userEmail = JSON.parse(localStorage.getItem("email"));

    this.fstore.collection("RegisteredUsers").doc(this.userEmail)
    .get().subscribe((doc) => {
      if(doc.exists){
          this.loggedUser = doc.data();
        }
      })
  }

  logOut(){
    this.auth.signOut()
    .then(() => {
      localStorage.removeItem("email");
      //window.location.reload();
      this.router.navigate(['main-page/login']);
    })
  }

  async emailOpen(){
    const email :EmailComposerOptions= {
      app: 'gmail',
      to: 'theincredibles173@gmail.com',
    };
    await this.composer.open(email);
  }
}
